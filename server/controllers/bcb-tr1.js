const createController = require('./bcb-date-value-generic');
const TR1Model = require('../models/tr1');

module.exports = createController(TR1Model, 'TR1'); // TR1 SGS code