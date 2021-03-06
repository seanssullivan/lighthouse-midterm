// db/tables/menu_items.js

/**
 * Manages all requests to the menu_items table of the database.
 */
class MenuItemsTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Retrieve all menu items.
   * @param {String} visitorId
   */
  all(visitorId = null) {
    const queryString = `
      SELECT menu_items.id, name, description, cost, image_url, sold_out, (
        SELECT ROUND(AVG(rating))
        FROM item_reviews
        WHERE item_reviews.id = menu_items.id
      ) AS average_rating, (
        SELECT item_reviews.rating
        FROM item_reviews
        WHERE item_reviews.item_id = menu_items.id
          AND item_reviews.visitor_id = $1
      ) AS user_rating
      FROM menu_items;
    `;
    return this.db
      .query(queryString, [ visitorId ]);
  }

  /**
   * Retrieve a menu item by its id.
   * @param {String} visitorId
   * @param {Number} itemId 
   */
  get(visitorId, itemId) {
    const queryString = `
      SELECT menu_items.id, name, description, cost, image_url, sold_out, (
        SELECT ROUND(AVG(rating))
        FROM item_reviews
        WHERE item_reviews.id = menu_items.id
      ) AS average_rating, (
        SELECT item_reviews.rating
        FROM item_reviews
        WHERE item_reviews.item_id = menu_items.id
          AND item_reviews.visitor_id = $1
      ) AS user_rating
      FROM menu_items
      WHERE menu_items.id = $2;
    `;

    return this.db
      .query(queryString, [ visitorId, itemId ]);
  }

}

module.exports = MenuItemsTable;
