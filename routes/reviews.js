// routes/reviews.js

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
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
}