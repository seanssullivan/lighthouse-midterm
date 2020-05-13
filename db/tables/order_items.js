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
      SELECT menu_items.id, menu_items.name, order_items.quantity
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

  /**
   * Retrieve all items for orders by their order_id.
   * @param {Number} orderIds - The foreign keys for the orders.
   * @param {Object} client
   */
  getMany(orderIds) {
    const queryString = `
      SELECT menu_items.id, menu_items.name, order_items.quantity
      FROM order_items
      JOIN menu_items
        ON menu_items.id = item_id
      WHERE order_id IN $1
      ORDER BY menu_items.id;
    `;
    const ids = `(${orderIds.join(', ')})`;
    return this.db
      .query(queryString, [ids]);
  }

  /**
   * Inserts new order items.
   * @param {Number} orderId - The foreign key for the order.
   * @param {Array} items
   */
  addMany(orderId, items) {
    let queryString = 'INSERT INTO order_items (order_id, item_id, quantity) VALUES ';
    const queryValues = [];
    let values = [];
    let counter = 1;
    for (const item of items) {
      queryValues.push(`($${counter}, $${counter + 1}, $${counter + 2})`);
      values = values.concat([ orderId, item.id, item.quantity ]);
      counter += 3;
    }
    queryString = queryString + queryValues.join(', ') + ' RETURNING *;';
    return this.db
      .query(queryString, values);
  }

}

module.exports = OrderItemsTable;
