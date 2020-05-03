// db/tables/order_items.js

/**
 * Manages all requests to the order_items table of the database.
 */
class OrderItemsTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Retrieve all items for an order by its order_id.
   * @param {Number} orderId - The foreign key for the order.
   */
  get(orderId) {
    const queryString = `
      SELECT menu_items.name, order_items.quantity
      FROM order_items
      JOIN menu_items ON menu_items.id = item_id
      WHERE order_id = $1
      ORDER BY menu_items.id;
    `;
    return this.db
      .query(queryString, [orderId]);
  }

}

module.exports = OrderItemsTable;
