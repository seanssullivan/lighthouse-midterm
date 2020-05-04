// routes/reviews.js

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  /**
   * Retrieve all reviews for a user.
   */
  router.get("/reviews", (req, res, next) => {
    const visitorId = req.session.user_id;
    db.itemReviews.get(visitorId)
      .then(data => {
        res.json({
          status: 'success',
          results: data.length,
          data: {
            itemReviews: data
          }
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  });

  /**
   * Add a review.
   */
  router.post("/reviews", (req, res, next) => {
    const visitorId = req.session.user_id;
    db.orders.add(visitorId, req.body)
      .then(data => {
        res.status(201).json({
          status: 'success',
          data: {
            itemReviews: data
          }
        })
      })
  })

  /**
   * Update a review.
   */
  router.put("/reviews", (req, res, next) => {
    const visitorId = req.session.user_id;
    db.orders.update(visitorId, req.body)
      .then(data => {
        res.status(204).json({
          status: 'success',
          data: {
            itemReviews: data 
          }
        })
      })
  })
  
  return router;
};