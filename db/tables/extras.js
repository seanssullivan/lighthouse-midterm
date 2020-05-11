// db/tables/extras.js

/**
 * Manages all requests to the extras table of the database.
 */
class ExtrasTable {

  constructor(database) {
    this.db = database;
  }

  /**
   * Retrieve all extras.
   */
  get() {
    const queryString = `
      SELECT *
      FROM extras
      ORDER BY extras.id;
    `;
    return this.db
      .query(queryString);
  }

}

module.exports = ExtrasTable;
