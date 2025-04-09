const express = require('express');
const router = express.Router();
const createController = require('../controllers/bcb-date-value-generic');
const CDIModel = require('../models/cdi');
const SelicModel = require('../models/selic');
const USD_PtaxModel = require('../models/usd-ptax');
const EUR_PtaxModel = require('../models/eur-ptax');
const TR1Model = require('../models/tr1');
const PoupancaNovaModel = require('../models/poupanca-nova');
const BCB_SERIES = require('../config/dataseries-codes');

const controllers = {
  cdi: createController(CDIModel, 'CDI'),
  selic: createController(SelicModel, 'SELIC'),
  usd_ptax: createController(USD_PtaxModel, 'USD_PTAX'),
  eur_ptax: createController(EUR_PtaxModel, 'EUR_PTAX'),
  tr1: createController(TR1Model, 'TR1'),
  poupanca_nova: createController(PoupancaNovaModel, 'POUPANCA_NOVA')
  // Add other series controllers here
};

// Endpoint to list available series
router.get('/series', (req, res) => {
  const seriesList = Object.keys(BCB_SERIES).map(key => ({
    key: key.toLowerCase(),
    name: key,
    sgsCode: BCB_SERIES[key]
  }));
  res.json(seriesList);
});

router.route('/:series/bcb-data').get((req, res) => {
  const controller = controllers[req.params.series.toLowerCase()];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.getData(req, res);
});

router.route('/:series/records').get((req, res) => {
  const controller = controllers[req.params.series];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.getAllRecords(req, res);
});

router.route('/:series/records/:id').patch((req, res) => {
  console.log('PATCH request received');
  const controller = controllers[req.params.series];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.updateRecord(req, res);
});

router.route('/:series/most-recent-date').get((req, res) => {
  const controller = controllers[req.params.series];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.getMostRecentDate(req, res);
});

router.route('/:series/records/delete-from').delete((req, res) => {
  const controller = controllers[req.params.series];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.deleteRecordsFromDate(req, res);
});


module.exports = router;