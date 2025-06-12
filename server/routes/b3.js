const express = require('express');
const router = express.Router();
const createController = require('../controllers/b3Controller');

// Import models for each series
const DI1_FuturesModel = require('../models/futuresDI1');

module.exports = (app) => { // <-- The route file now exports a function
  const controllers = {
    // Pass the 'app' object when creating each controller instance
    di1: createController(DI1_FuturesModel, 'DI1', app), // <-- Pass 'app' here

    // Add other series controllers here, also passing 'app'
  };

  router.get('/di1/getb3', controllers.di1.getData);
  router.get('/di1/getMostRecentDate', controllers.di1.getMostRecentDate);

  return router; // Return the configured router
};