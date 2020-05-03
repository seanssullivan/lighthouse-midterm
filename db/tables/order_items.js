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

  /**
   * Inserts new order items.
   * @param {Array} orderItems 
   */
  add(orderId, orderItems) {
    const queryValueStrings = [];
    let insertValues = [];
    const placeholderCounter = 1;
    
    // Loop over available order items and format them
    for (const i = 0; i < orderItems.length; i++) {
      queryValueStrings.push(`(${counter}, ${counter + 1}, ${counter + 2})`);
      insertValues = insertValues.concat([ orderId, item.menuItemId, item.quantity ]);
      placeholderCounter += 3;
    }

    // Compile the query string
    const insertOrderItemsQueryString = `INSERT INTO order_items (order_id, item_id, quantity) VALUES `;
    insertOrderItemsQueryString += queryValueStrings.join(', ') + ' RETURNING *;';
    return this.db
      .query(insertOrderItemsQueryString, insertValues);
  }

}

module.exports = OrderItemsTable;
