// db/tables/recurring_pattern.js

/**
 * Manages all requests to the recurring_pattern table of the database.
 */
class RecurringPatternTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Inserts a recurring pattern.
   * @param {Number} discountId
   * @param {Object} pattern 
   */
  add(discountId, pattern) {
    const queryString = `
      INSERT INTO recurring_pattern (discount_id. recurring_type, separation_count, max_num_occurrences, day_of_week, week_of_month, day_of_month, month_of_year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURN *;
    `;
    const values = [
      discountId,
      pattern.recurringType,
      pattern.separationCount,
      pattern, maxNumOccurrences,
      pattern.dayOfWeek,
      pattern.weekOfMonth,
      pattern.dayOfMonth,
      pattern.monthOfYear
    ];
    return this.db
      .query(queryString, values);
  }

  /**
   * Retrieve a recurring pattern by its discount id.
   * @param {Number} discountId
   */
  get(discountId) {
    const queryString = `
      SELECT *
      FROM recurring_pattern
      WHERE discount_id = $1
      RETURN *;
    `;
    return this.db
      .query(queryString, [ discountId ]);
  }

}

module.exports = RecurringPatternTable;
