// routes/orders.js

/*
 * All routes for orders are defined here.
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  /**
   * Retrieves all order records.
   */
  router.get("/", (req, res, next) => {

    db.orders.all()
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
   * Retrieves all pending orders.
   */
  router.get("/pending", (req, res, next) => {

    db.orders.getPending({ offset: 0, limit: 10 })
      .then(data => {
        console.log(data);
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
   * Retrieves all pending orders.
   */
  router.get("/confirmed", (req, res, next) => {

    db.orders.getConfirmed({ offset: 0, limit: 10 })
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
   * Retrieves all ready orders.
   */
  router.get("/ready", (req, res, next) => {

    db.orders.getReady({ offset: 0, limit: 10 })
      .then(data => {
        res.status(200).json({
          status: 'success',
          results: data.length,
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })

  /**
   * Retirves all completed orders.
   */
  router.get("/completed", (req, res, next) => {

    db.orders.getCompleted({ offset: 0, limit: 10 })
      .then(data => {
        res.status(200).json({
          status: 'success',
          results: data.length,
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })

  /**
   * Adds a new order.
   */
  router.post("/add", (req, res, next) => {

    db.orders.add(req.body)
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
   * Retrieves an order by its primary key.
   */
  router.get("/:id", (req, res, next) => {
    
    db.orders.get(req.params.id)
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
   * Marks an order as confirmed.
   */
  router.put("/:id/confirm", (req, res, next) => {
    
    db.orders.markConfirmed(req.body.id)
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
   * Marks an order as ready.
   */
  router.put("/:id/ready", (req, res, next) => {
    
    db.orders.markReady(req.body.id)
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
   * Marks an order as completed.
   */
  router.put("/:id/complete", (req, res, next) => {
    
    db.orders.markCompleted(req.body.id)
      .then(data => {
        res.status(204).json({
          status: 'success'
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })

  /**
   * Retrieves all items for an order.
   */
  router.get("/:id/items", (req, res, next) => {
    
    db.orderItems.get(req.params.id)
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  })


  return router;
};
