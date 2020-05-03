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
  _buildQuery(options) {
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
    const queryString = this._buildQuery();
    return this.db
      .query(queryString);
  }

  /**
   * Retrieve an order by its primary key.
   * @param {Number} id 
   */
  get(id) {
    const queryString = this._buildQuery({ where: 'orders.id = $1'});
    return this.db
      .query(queryString, [id]);
  }

  /**
   * Retrieves any recent orders.
   */
  recent() {
    const queryString = this._buildQuery({ where: 'orders.confirmed_at IS NULL' });
    return this.db
      .query(queryString);
  }

  /**
   * Retrieves any pending orders.
   */
  pending() {
    const queryString = this._buildQuery({ where: 'orders.confirmed_at IS NOT NULL AND orders.ready_at IS NULL' });
    return this.db
      .query(queryString);
  }

  ready() {
    const queryString = this._buildQuery({ where: 'orders.ready_at IS NOT NULL AND orders.completed_at IS NULL' });
    return this.db
      .query(queryString);
  }

  /**
   * Retrieves all completed orders.
   */
  completed() {
    const queryString = this._buildQuery({ where: 'orders.completed_at IS NOT NULL' });
    return this.db
      .query(queryString);
  }

}

module.exports = OrdersTable;
