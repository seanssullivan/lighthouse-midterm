// db/index.js

// load .env data into process.env
require('dotenv').config();

const { Pool } = require("pg");

const MenuItemsTable = require('./tables/menu_items');
const OrdersTable = require('./tables/orders');
const OrderItemsTable = require('./tables/order_items');
const ItemReviewsTable = require('./tables/item_reviews');
const OrderExtrasTable = require('./tables/order_extras');

/**
 * Manages all interactions with the database.
 */
class DatabaseConnection {

  constructor() {
    this.pool = new Pool(this._parameters());

    // Connected database tables
    this.menuItems = new MenuItemsTable(this);
    this.orders = new OrdersTable(this);
    this.orderItems = new OrderItemsTable(this);
    this.itemReviews = new ItemReviewsTable(this);
    this.orderExtras = new OrderExtrasTable(this);
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
  async query(text, params) {
    const client = await this.pool.connect();
    const response = await client.query(text, params);
    client.release();
    return response.rows;
  }
}

// Instantiate the database connection
const databaseConnection = new DatabaseConnection();

// Freeze the database connection object
Object.freeze(databaseConnection);

// Export the database connection
module.exports = databaseConnection;
