// db/tables/menu_items.js

/**
 * Manages all requests to the menu_items table of the database.
 */
class MenuItemsTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Constructs the SQL query.
   * @param {Object} options - Optional statements to include in the SQL query
   */
  _buildQuery({ where = '', limit = '' }) {
    return `
      SELECT menu_items.id, name, description, cost, image_url, sold_out, (
        SELECT ROUND(AVG(rating))
        FROM item_reviews
        WHERE item_reviews.id = menu_items.id
      ) AS average_rating
      ${select ? ', ' + select : ''}
      FROM menu_items
      ${join ? 'JOIN ' + join : ''}
      ${where ? 'WHERE ' + where : ''}
      ${limit ? 'LIMIT ' + where : ''};
    `;
  }

  /**
   * Retrieve all menu items.
   * @param {String} visitorId
   */
  all(visitorId = null) {
    const options = {
      select: 'item_reviews.rating AS user_rating',
      join: 'item_reviews ON item_reviews.item_id = menu_items.id',
      where: 'item_reviews.visitor_id = $1'
    }
    const queryString = this._buildQuery(options);
    return this.db
      .query(queryString, [ visitorId ]);
  }

  /**
   * Retrieve a menu item by its id.
   * @param {Number} id 
   */
  get(id) {
    const queryString = this._buildQuery({ where: 'menu_items.id = $1' });
    return this.db
      .query(queryString, [id]);
  }

}

module.exports = MenuItemsTable;
