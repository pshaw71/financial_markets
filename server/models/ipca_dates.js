const mongoose = require('mongoose');
const datesSchema = require('./datesSchema');

const IPCA_Dates_Model = mongoose.model('ipca_dates', datesSchema, 'ipca_dates');
module.exports = IPCA_Dates_Model;