// db/tables/orders.js

/**
 * Manages all requests to the orders table of the database.
 */
class OrdersTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Constructs the SQL query.
   * @param {Object} options - Optional statements to include in the SQL query
   */
  _buildSelectQuery({ where, having, offset, limit }) {
    return `
      SELECT
        orders.id, orders.name, orders.phone, orders.email, orders.ordered_at,
        ARRAY(
          SELECT json_build_array(menu_items.id, menu_items.name, order_items.quantity)
          FROM order_items
          JOIN menu_items
            ON menu_items.id = item_id
          WHERE order_id = orders.id
          GROUP BY menu_items.id, menu_items.name, order_items.quantity
          ORDER BY menu_items.id
        ) AS menu_items,
        COUNT(order_items.order_id) AS num_items,
        SUM(ROUND(order_items.quantity * menu_items.cost * 100) / 100) AS total_cost,
        ARRAY(
          SELECT json_build_array(order_extras.item_id, extras.name, order_extras.quantity)
          FROM extras
          JOIN order_extras
            ON order_extras.extra_id = extras.id
          WHERE order_id = orders.id
          ORDER BY extras.id
        ) AS extras,
        (CASE
          WHEN orders.completed_at IS NOT NULL THEN 'completed'
          WHEN orders.ready_at IS NOT NULL THEN 'ready'
          WHEN orders.confirmed_at IS NOT NULL THEN 'confirmed'
          WHEN orders.ordered_at IS NOT NULL THEN 'ordered'
          ELSE NULL
        END) AS status
      FROM orders
      JOIN order_items ON order_id = orders.id
      JOIN menu_items ON menu_items.id = order_items.item_id
      ${where ? 'WHERE ' + where : ''}
      GROUP BY orders.id, orders.name, orders.phone, orders.email, ordered_at
      ${having ? 'HAVING ' + having : ''}
      ORDER BY orders.ordered_at ASC
      ${limit ? 'LIMIT ' + limit : ''}${ limit && offset ? ' OFFSET ' + offset : ''};
    `;
  }

  /**
   * Retrieve all order records.
   */
  all() {
    const queryString = this._buildSelectQuery();
    return this.db
      .query(queryString);
  }

  /**
   * Begins an order record.
   * @param {Object} name 
   */
  add(orderObj) {
    const insertOrderQueryString = `
      INSERT INTO orders (name, phone, email, ordered_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [ orderObj.name, orderObj.phone, orderObj.email ];
    return this.db.query(insertOrderQueryString, values)
      .then((res) => {
        const order = res[0];
        order.items = this.db.orderItems.addMany(order.id, orderObj.items);
        return order;
      })
      .then((order) => {
        if (orderObj.extras) {
          order.extras = this.db.orderExtras.addMany(order.id, orderObj.extras);
        }
        return order;
      });
  }

  /**
   * Retrieve an order by its primary key.
   * @param {Number} orderId 
   */
  get(orderId) {
    const queryString = this._buildSelectQuery({ where: 'orders.id = $1', having: '', offset: 0, limit: 0});
    return this.db
      .query(queryString, [orderId]);
  }

  /**
   * Retrieves any pending orders.
   */
  async getPending({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.ordered_at IS NOT NULL AND orders.confirmed_at IS NULL", offset: offset, limit: limit });
    console.log(queryString);
    return this.db
      .query(queryString);
  }

  /**
   * Retrieves any confirmed orders.
   */
  getConfirmed({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.confirmed_at IS NOT NULL AND orders.ready_at IS NULL", offset: offset, limit: limit });
    return this.db
      .query(queryString);
  }

   /**
   * Confirm receipt of a new order.
   * @param {Number} orderId 
   */
  markConfirmed(orderId) {
    const queryString = `
      UPDATE orders
      SET confirmed_at = NOW()
      WHERE order_id = $1;
    `;
    return this.db
      .query(queryString, [orderId]);
  }

  /**
   * Retrieves any ready orders.
   */
  getReady({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.ready_at IS NOT NULL AND orders.completed_at IS NULL", offset: offset, limit: limit });
    return this.db
      .query(queryString);
  }

  /**
   * Update order as ready.
   * @param {Number} orderId 
   */
  markReady(orderId) {
    const queryString = `
      UPDATE orders
      SET ready_at = NOW()
      WHERE order_id = $1;
    `;
    return this.db
      .query(queryString, [orderId]);
  }

  /**
   * Retrieves all completed orders.
   */
  getCompleted({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.completed_at IS NOT NULL", offset: offset, limit: limit });
    return this.db
      .query(queryString);
  }

   /**
   * Update order as ready.
   * @param {Number} orderId 
   */
  markCompleted(orderId) {
    const queryString = `
      UPDATE orders
      SET completed_at = NOW()
      WHERE order_id = $1;
    `;
    return this.db
      .query(queryString, [orderId]);
  }

}

module.exports = OrdersTable;
