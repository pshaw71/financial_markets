const createController = require('./genericController');
const EUR_PtaxModel = require('../models/selic');

module.exports = createController(EUR_PtaxModel, 'EUR_PTAX');