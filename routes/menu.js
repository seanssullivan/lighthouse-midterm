// routes/menu.js

/*
 * All routes for menu items are defined here.
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res, next) => {

    /**
     * Retrieves all menu items.
     */
    db.menuItems.all()
      .then(data => {
        res.json({
          status: 'success',
          results: data.length,
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  });

  /**
   * Adds a menu item.
   */
  router.post("/", (req, res, next) => {
    res.status(200).json({
      message: 'Maybe one day this will be done but not today'
    })
  })

  /**
   * Retrieves a menu item by its primary key.
   */
  router.get("/:id", (req, res, next) => {

    db.menuItems.get(req.params.id)
      .then(data => {
        res.json({
          status: 'success',
          data: data[0]
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })
  
  return router;
};
