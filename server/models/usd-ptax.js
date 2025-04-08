const mongoose = require('mongoose');
const dataSchema = require('./date-valueSchema');

const USD_PtaxModel = mongoose.model('USD_Ptax', dataSchema, 'usd_ptax'); // 'usd_ptax' is the collection name
module.exports = USD_PtaxModel;