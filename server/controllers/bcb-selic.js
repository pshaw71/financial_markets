const createController = require('./genericController');
const SelicModel = require('../models/selic');

module.exports = createController(SelicModel, 'SELIC');