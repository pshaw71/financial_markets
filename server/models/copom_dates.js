const mongoose = require('mongoose');
const datesSchema = require('./datesSchema');

const COPOM_Model = mongoose.model('copom_dates', datesSchema, 'copom_dates');
module.exports = COPOM_Model;