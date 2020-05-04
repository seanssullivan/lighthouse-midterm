// db/tables/item_reviews.js

/**
 * Manages all requests to the item_reviews table of the database.
 */
class ItemReviewsTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Inserts an item review.
   * @param {String} visitorId 
   * @param {Object} review 
   */
  add(visitorId, review) {
    const queryString = `
      INSERT INTO item_reviews (visitor_id, item_id, rating)
      VALUES ($1, $2, $3)
      RETURN *;
    `;
    const values = [ visitorId, review.itemId, review.rating ];
    return this.db
      .query(queryString, values);
  }

  /**
   * Retrieve all item reviews for by the visitor id.
   * @param {String} visitorId - The visitor's unique id.
   */
  get(visitorId) {
    const queryString = `
      SELECT id, item_id, rating
      FROM item_reviews
      WHERE visitor_id = $1
      RETURN *;
    `;
    return this.db
      .query(queryString, [visitorId]);
  }

  /**
   * Update a visitor's item review.
   * @param {String} visitorId 
   * @param {Object} review 
   */
  update(visitorId, review) {
    const queryString = `
      UPDATE item_reviews
      SET rating = $1
      WHERE visitor_id = $2 AND item_id = $3
      RETURN *;
    `;
    const values = [ review.rating, visitorId, review.itemId ];
    return this.db
      .query(queryString, values);
  }

}

module.exports = ItemReviewsTable;
