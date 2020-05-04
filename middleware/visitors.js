// middleware/visitors.js

const { generateRandomString } = require('../utils/randomString');

/**
 * Checks for visitor id.
 * @param {Object} database
 */
const visitors = (database) => {
  return (req, res, next) => {
    if (!req.session.user_id) {
      req.session.user_id = assignVisitorId(database);
    }
    next();
  };
};

const assignVisitorId = (database) => {
  const visitorId = generateRandomString(16);
  // TODO: Use database connection to update user visits table.
  return visitorId;
}

module.exports = { visitors };
