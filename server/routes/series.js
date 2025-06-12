const express = require('express');
const router = express.Router();
const DATA_SERIES = require('../config/dataseries-codes');
const GOOGLE_SERIES = require('../config/googleSeries');
const B3_SERIES = require('../config/b3Series');

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

  const b3SeriesList = Object.keys(B3_SERIES).map(key => ({
    key: key.toLowerCase(),
    name: B3_SERIES[key].name,
    schemaType: B3_SERIES[key].schemaType
  }));

  // Combine all series lists into one
  const seriesList = [...bcbSeriesList, ...googleSeriesList, ...b3SeriesList];
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