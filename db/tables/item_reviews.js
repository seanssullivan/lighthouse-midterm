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
   * @param {Number} itemId 
   * @param {Number} rating 
   */
  add(visitorId, itemId, rating) {
    const queryString = `
      INSERT INTO item_reviews (visitor_id, item_id, rating)
      VALUES ($1, $2, $3)
      RETURN *;
    `;
    const values = [ visitorId, itemId, rating ];
    return this.db
      .query(queryString, values);
  }

  /**
   * Retrieve a review for an item by the visitor id.
   * @param {String} visitorId - The visitor's unique id.
   * @param {Number} itemId - The foreign key for the item.
   */
  get(visitorId, itemId) {
    const queryString = `
      SELECT id, item_id, rating
      FROM item_reviews
      WHERE visitor_id = $1
        AND item_id = $2
      RETURN *;
    `;
    return this.db
      .query(queryString, [ visitorId, itemId ]);
  }

  /**
   * Update a visitor's item review.
   * @param {String} visitorId 
   * @param {Number} itemId
   * @param {Number} review 
   */
  update(visitorId, itemId, rating) {
    const queryString = `
      UPDATE item_reviews
      SET rating = $1
      WHERE visitor_id = $2 AND item_id = $3
      RETURN *;
    `;
    const values = [ rating, visitorId, itemId ];
    return this.db
      .query(queryString, values);
  }

}

module.exports = ItemReviewsTable;
