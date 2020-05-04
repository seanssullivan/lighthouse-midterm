// db/tables/discounts.js

/**
 * Manages all requests to the discounts table of the database.
 */
class DiscountsTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Returns all active and upcoming discounts.
   */
  all() {
    const queryString = `
      SELECT *
      FROM discounts
      WHERE end_date > NOW();
    `;
    return this.db
      .query(queryString);
  }

  /**
   * Inserts a discount.
   * @param {Object} discount 
   */
  async add(discount) {
    const queryString = `
      INSERT INTO discounts (amount, start_date, end_date, is_recurring)
      VALUES ($1, $2, $3, $4)
      RETURN *;
    `;
    const values = [ discount.amount, discount.startDate, discount.endDate ];
    const rDiscount = await this.db.query(queryString, values);
    
    if (discount.isRecurring = true) {
      const rPattern = await this.db.recurringPattern.add(rDiscount.id, discount);
      return Object.assign(rDiscount, rPattern);
    } else {
      return rDiscount;
    }
  }

  /**
   * Retrieve a discount by its id.
   * @param {Number} discountId
   */
  get(discountId) {
    const queryString = `
      SELECT *
      FROM discounts
      WHERE id = $1
      RETURN *;
    `;
    return this.db
      .query(queryString, [ discountId ]);
  }

  /**
   * Update a discount.
   * @param {Object} discount 
   */
  update(discount) {
    const queryString = `
      UPDATE discount
      SET amount = $1, start_date = $2, end_date = $3, is_recurring = $4
      WHERE id = $5
      RETURN *;
    `;
    const values = [ discount.amount, discount.startDate, discount.endDate, discount.isRecurring, discount.id ];
    return this.db
      .query(queryString, values);
  }

  /**
   * Removes a discount from the database.
   * @param {Number} discountId 
   */
  delete(discountId) {
    const queryString = `
      DELETE FROM discounts
      WHERE id = $1;
    `;
    return this.db
      .query(queryString, [ discountId ]);
  }

}

module.exports = DiscountsTable;
