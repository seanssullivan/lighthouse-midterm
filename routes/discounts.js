// routes/discounts.js

/*
 * All routes for discounts are defined here.
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  /**
   * Retrieves all current or future discounts.
   */
  router.get("/", (req, res, next) => {

    db.discounts.all()
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
   * Adds a new discount.
   */
  router.post("/add", (req, res, next) => {

    db.discounts.add(req.body)
      .then(data => {
        res.status(201).json({
          status: 'success',
          data: data[0]
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })

  /**
   * Retrieves a discount by its primary key.
   */
  router.get("/:id", (req, res, next) => {
    
    db.discounts.get(req.params.id)
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data[0]
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })

  /**
   * Updates a discount.
   */
  router.put("/:id", (req, res, next) => {
    
    db.discounts.update(req.body)
      .then(data => {
        res.status(204).json({
          status: 'success',
          data: data[0]
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })

  /**
   * Deletes a discount.
   */
  router.delete("/:id", (req, res, next) => {

    db.discounts.delete(req.params.id)
      .then(data => {
        res.status(204).json({
          status: 'success'
        })
      })
  })

  return router;
};
