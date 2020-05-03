/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/new", (req, res, next) => {

    db.orders.pending()
      .then(data => {
        res.json({
          status: 'success',
          results: data.length,
          data: {
            orders: data
          }
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
  });

  router.post("/add", (req, res, next) => {
    db.orders.add(req.body)
      .then(data => {
        res.status(201).json({
          status: 'success',
          data: {
            orders: data
          }
        })
      })
  })

  router.put("/add", (req, res, next) => {
    db.orders.update(req.body)
      .then(data => {
        res.status(204).json({
          status: 'success',
          data: {
            orders: data 
          }
        })
      })
  })

  router.get("/ready", (req, res, next) => {
    db.orders.ready()
      .then(data => {
        console.log(data)
        res.status(200).json({
          status: 'success',
          results: data.length,
          data: {
            orders: data
          }
        })
      })
  })

  router.get("/completed", (req, res, next) => {
    db.orders.completed()
      .then(data => {
        res.status(400).json({
          status: 'success',
          results: data.length,
          data: {
            orders: data
          }
        })
      })
  })
  return router;
};
