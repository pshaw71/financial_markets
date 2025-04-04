const createController = require('./bcb-date-value-generic');
const CDIModel = require('../models/cdi');

module.exports = createController(CDIModel, 'CDI'); // CDI SGS code