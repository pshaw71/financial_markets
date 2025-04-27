const express = require('express');
const router = express.Router();
const DATA_SERIES = require('../config/dataseries-codes');
const GOOGLE_SERIES = require('../config/googleSeries');

router.get('/series', (req, res) => {
  const bcbSeriesList = Object.keys(DATA_SERIES).map(key => ({
    key: key.toLowerCase(),
    name: key,
    sgsCode: DATA_SERIES[key].sgsCode,
    startDate: DATA_SERIES[key].startDate,
    schemaType: DATA_SERIES[key].schemaType
  }));
  const googleSeriesList = Object.keys(GOOGLE_SERIES).map(key => ({
    key: key.toLowerCase(),
    name: GOOGLE_SERIES[key].name,
    schemaType: GOOGLE_SERIES[key].schemaType
  }));
  const seriesList = [...bcbSeriesList, ...googleSeriesList];
  console.log('seriesList', seriesList);
  res.json(seriesList);
});


// Endpoint to list available series
// router.get('/series', (req, res) => {
//   const seriesList = Object.keys(DATA_SERIES).map(key => ({
//     key: key.toLowerCase(),
//     name: key,
//     sgsCode: DATA_SERIES[key]
//   }));
//   res.json(seriesList);
// });

module.exports = router;