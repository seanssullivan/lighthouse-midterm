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
        COUNT(order_items.item_id) AS menu_items,
        SUM(order_items.quantity) AS total_items,
        SUM(ROUND(order_items.quantity * menu_items.cost * 100) / 100) AS total_cost,
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
      ${limit ? 'LIMIT ' + limit : ''}${ limit && offset ? 'OFFSET ' + offset : ''};
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
      INSERT INTO orders (name, phone, email)
      VALUES ($1, $2, $3)
      RETURN id;
    `;

    const values = [ orderObj.name, orderObj.phone, orderObj.email ];
    this.db.query(insertOrderQueryString, values)
      .then((orderId) => this.db.orderItems.addMany(orderId, orderObj.items))
      .then((items) => this.db.orderExtras.add(orderId, orderObj.extras));
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
  getPending({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.ordered_at IS NOT NULL AND orders.confirmed_at IS NULL", offset: offset, limit: limit });
    return this.db
      .query(queryString)
      .then((orders) => {
        for (const order of orders) {
          order.items = await this.db.orderItems.get(order.id);
        }
        return orders;
      });
  }

  /**
   * Retrieves any confirmed orders.
   */
  getConfirmed({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.confirmed_at IS NOT NULL AND orders.ready_at IS NULL", offset: offset, limit: limit });
    return this.db
      .query(queryString)
      .then((orders) => {
        for (const order of orders) {
          order.items = await this.db.orderItems.get(order.id);
        }
        return orders;
      });
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
      .query(queryString)
      .then((orders) => {
        for (const order of orders) {
          order.items = await this.db.orderItems.get(order.id);
        }
        return orders;
      });
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
  async getCompleted({ offset, limit }) {
    const queryString = this._buildSelectQuery({ where: '', having: "orders.completed_at IS NOT NULL", offset: offset, limit: limit });
    return this.db
      .query(queryString)
      .then((orders) => {
        for (const order of orders) {
          order.items = await this.db.orderItems.get(order.id);
        }
        return orders;
      });
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
