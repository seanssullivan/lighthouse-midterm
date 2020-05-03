// db/tables/orders.js

/**
 * Manages all requests to the orders table of the database.
 */
class OrdersTable {

  constructor(database) {
    this.db = database;
    this.tableName = 'orders';
  }

  /**
   * Constructs the SQL query.
   * @param {Object} options - Optional statements to include in the SQL query
   */
  _buildSelectQuery(options) {
    if (!options) options = { where: '' };

    return `
      SELECT
        orders.id, orders.name, orders.phone, orders.email, orders.ordered_at,
        COUNT(order_items.id) AS menu_items,
        SUM(order_items.quantity) AS total_items,
        SUM(ROUND(order_items.quantity * menu_items.cost * 100) / 100) AS total_cost
      FROM ${this.tableName}
      JOIN order_items ON order_id = orders.id
      JOIN menu_items ON menu_items.id = order_items.item_id
      ${options.where ? 'WHERE ' + options.where : ''}
      GROUP BY orders.id, orders.name, orders.phone, orders.email, ordered_at
      ORDER BY orders.ordered_at ASC
      ${options.limit ? 'LIMIT ' + options.limit : ''};
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
  async add(orderObj) {
    const insertOrderQueryString = `
      INSERT INTO orders (name, phone, email)
      VALUES ($1, $2, $3)
      RETURN id;
    `;
    const values = [ orderObj.name, orderObj.phone, orderObj.email ];
    this.db.query(insertOrderQueryString, values)
      .then((orderId) => this.db.orderItems.add(orderId, orderObj.items));
    
  }

  /**
   * Retrieve an order by its primary key.
   * @param {Number} id 
   */
  get(id) {
    const queryString = this._buildSelectQuery({ where: 'orders.id = $1'});
    return this.db
      .query(queryString, [id]);
  }

  /**
   * Retrieves any recent orders.
   */
  getRecent() {
    const queryString = this._buildSelectQuery({ where: 'orders.confirmed_at IS NULL' });
    return this.db
      .query(queryString);
  }

  /**
   * Retrieves any pending orders.
   */
  getPending() {
    const queryString = this._buildSelectQuery({ where: 'orders.confirmed_at IS NOT NULL AND orders.ready_at IS NULL' });
    return this.db
      .query(queryString);
  }

   /**
   * Confirm receipt of a new order.
   * @param {Number} orderId 
   * @param {Object} orderItems
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
  getReady() {
    const queryString = this._buildSelectQuery({ where: 'orders.ready_at IS NOT NULL AND orders.completed_at IS NULL' });
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
  getCompleted() {
    const queryString = this._buildSelectQuery({ where: 'orders.completed_at IS NOT NULL' });
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
