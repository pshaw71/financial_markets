const mongoose = require('mongoose');
const datesSchema = require('./datesSchema');

const holidaysBR_Model = mongoose.model('holidaysbr_dates', datesSchema, 'holidaysbr_dates');
module.exports = holidaysBR_Model;