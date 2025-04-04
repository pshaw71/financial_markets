const express = require('express');
const router = express.Router();
const createController = require('../controllers/bcb-date-value-generic');
const CDIModel = require('../models/cdi');
const SelicModel = require('../models/selic');
const BCB_SERIES = require('../config/dataseries-codes');

const controllers = {
  cdi: createController(CDIModel, 'CDI'),
  selic: createController(SelicModel, 'SELIC')
};

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
  const controller = controllers[req.params.series];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.updateRecord(req, res);
});

router.route('/:series/records/:id').delete((req, res) => {
  const controller = controllers[req.params.series];
  if (!controller) return res.status(404).json({ error: 'Series not found' });
  controller.deleteRecord(req, res);
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