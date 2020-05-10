// db/tables/order_items.js

/**
 * Manages all requests to the order_items table of the database.
 */
class OrderItemsTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Retrieve all items for an order by their order_id.
   * @param {Number} orderId - The foreign key for the order.
   */
  get(orderId) {
    const queryString = `
      SELECT menu_items.name, order_items.quantity
      FROM order_items
      JOIN menu_items
        ON menu_items.id = item_id
      WHERE order_id = $1
      ORDER BY menu_items.id;
    `;
    return this.db
      .query(queryString, [orderId]);
  }

  /**
   * Inserts a new order item, or increments the quantity of that item by 1.
   * @param {Number} orderId - The foreign key for the order.
   * @param {Number} itemId - The foreign key for the item.
   */
  add(orderId, itemId) {
    const queryString = `
      INSERT INTO order_items (order_id, item_id)
      VALUES ($1, $2)
      ON CONFLICT (order_id, item_id)
      DO UPDATE
      SET quantity = order_items.quantity + 1
      WHERE order_items.order_id = $1
        AND order_items.item_id = $2
      RETURNING *;
    `;
    const values = [ orderId, itemId ];
    return this.db
      .query(queryString, values)
      .then(items => {
        return items[0];
      });
  }

  /**
   * Decrement the quantity of an item by 1.
   * @param {Number} orderId - The foreign key for the order.
   * @param {Number} itemId - The foreign key for the item.
   */
  remove(orderId, itemId) {
    const queryString = `
      UPDATE order_items
      SET quantity = order_items.quantity - 1
      WHERE order_items.order_id = $1
        AND order_items.item_id = $2
      RETURNING *;
    `;
    const values = [ orderId, itemId ];
    return this.db
      .query(queryString, values)
      .then(items => {
        return items[0];
      });
  }

}

module.exports = OrderItemsTable;
