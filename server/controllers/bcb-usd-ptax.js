const createController = require('./genericController');
const USD_PtaxModel = require('../models/selic');

module.exports = createController(USD_PtaxModel, 'USD_PTAX');