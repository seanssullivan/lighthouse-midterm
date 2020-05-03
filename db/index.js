// load .env data into process.env
require('dotenv').config();

const { Pool } = require("pg");

class Database {

  constructor() {
    this.pool = new Pool(this._parameters());
  }

  /**
   * Sets database connection parameters from environmental variables.
   */
  _parameters() {
    return process.env.DATABASE_URL ? {
      connectionString: process.env.DATABASE_URL
    } : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    };
  }

  /**
   * Execute an SQL query against the connected database.
   * @param {String} text - A valid SQL query string.
   * @param {Object} params - Query parameters.
   */
  query(text, params) {
    return pool.query(text, params);
  }

}