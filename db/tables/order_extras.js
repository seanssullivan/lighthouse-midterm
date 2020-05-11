// db/tables/order_extras.js

/**
 * Manages all requests to the order_extras table of the database.
 */
class OrderExtrasTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Retrieve all extras for an item by the order_id and item_id.
   * @param {Number} orderId - The foreign key for the order.
   * @param {Number} itemId - The foreign key for the item.
   */
  get(orderId, itemId) {
    const queryString = `
      SELECT extras.name, order_extras.quantity
      FROM extras
      JOIN order_extras
        ON order_extras.extra_id = extras.id
      WHERE order_id = $1
        AND item_id = $2
      ORDER BY extras.id;
    `;
    return this.db
      .query(queryString, [ orderId, itemId ]);
  }

  /**
   * Inserts a new item extra, or increments the quantity of that extra by 1.
   * @param {Number} orderId - The foreign key for the order.
   * @param {Number} itemId - The foreign key for the item.
   * @param {Number} extraId - The foreign key for the extra.
   */
  add(orderId, itemId, extraId) {
    const queryString = `
      INSERT INTO order_extras (order_id, item_id, extra_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (order_id, item_id, extra_id)
      DO UPDATE
      SET quantity = order_extras.quantity + 1
      WHERE order_extras.order_id = $1
        AND order_extras.item_id = $2
        AND order_extras.extra_id = $3
      RETURNING *;
    `;
    const values = [ orderId, itemId, extraId ];
    return this.db
      .query(queryString, values)
      .then(items => {
        return items[0];
      });
  }

  /**
   * Decrement the quantity of an extra by 1.
   * @param {Number} orderId - The foreign key for the order.
   * @param {Number} itemId - The foreign key for the item.
   * @param {Number} extraId - The foreign key for the extra.
   */
  remove(orderId, itemId, extraId) {
    const queryString = `
      UPDATE order_items
      SET quantity = order_items.quantity - 1
      WHERE order_extras.order_id = $1
        AND order_extras.item_id = $2
        AND order_extras.extra_id = $3
      RETURNING *;
    `;
    const values = [ orderId, itemId, extraId ];
    return this.db
      .query(queryString, values)
      .then(items => {
        return items[0];
      });
  }

}

module.exports = OrderExtrasTable;
