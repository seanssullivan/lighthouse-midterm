// db/tables/menu_items.js

/**
 * Manages all requests to the menu_items table of the database.
 */
class MenuItemsTable {

  constructor(database) {
    this.db = database;
    this.tableName = 'menu_items';
  }

  /**
   * Constructs the SQL query.
   * @param {Object} options - Optional statements to include in the SQL query
   */
  _buildQuery(options) {
    if (!options) options = { where: '' };

    return `
      SELECT menu_items.id, name, description, cost, image_url, sold_out, (
        SELECT ROUND(AVG(rating))
        FROM item_reviews
        WHERE item_reviews.id = menu_items.id
      ) AS average_rating
      FROM ${this.tableName}
      ${options.where ? 'WHERE ' + options.where : ''}
      ${options.limit ? 'LIMIT ' + options.where : ''};
    `;
  }

  /**
   * Retrieve all menu items.
   */
  all() {
    const queryString = this._buildQuery();
    return this.db
      .query(queryString);
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
