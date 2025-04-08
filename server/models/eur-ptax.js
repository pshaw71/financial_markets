const mongoose = require('mongoose');
const dataSchema = require('./date-valueSchema');

const EUR_PtaxModel = mongoose.model('EUR_Ptax', dataSchema, 'eur_ptax'); // 'eur_ptax' is the collection name
module.exports = EUR_PtaxModel;