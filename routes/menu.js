// routes/menu.js

/*
 * All routes for menu items are defined here.
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  /**
   * Retrieves all menu items.
   */
  router.get("/", (req, res, next) => {
    const visitorId = req.session.user_id;
    db.menuItems.all(visitorId)
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
   * Retrieves a menu item by its primary key.
   */
  router.get("/:id", (req, res, next) => {
    const visitorId = req.session.user_id;
    const itemId = req.params.id;
    db.menuItems.get(visitorId, itemId)
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

  /**
   * Retrieve a user's review of an item.
   */
  router.get("/:id/review", (req, res, next) => {
    const visitorId = req.session.user_id;
    const itemId = req.params.id;
    db.itemReviews.get(visitorId, itemId)
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
   * Add a review.
   */
  router.post("/:id/review", (req, res, next) => {
    const visitorId = req.session.user_id;
    const itemId = req.params.id;
    const rating = req.body;
    db.itemReviews.add(visitorId, itemId, rating)
      .then(data => {
        res.status(201).json({
          status: 'success',
          data: data
        })
      })
  })

  /**
   * Update a review.
   */
  router.put("/:id/review", (req, res, next) => {
    const visitorId = req.session.user_id;
    const itemId = req.params.id;
    const rating = req.body;
    db.itemReviews.update(visitorId, itemId, rating)
      .then(data => {
        res.status(204).json({
          status: 'success',
          data: data
        })
      })
  })
  
  return router;
};
