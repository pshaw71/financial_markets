const mongoose = require('mongoose');
const b3FuturesSchema = require('./b3FuturesSchema');

const DI1_Model = mongoose.model('futuresDI1', b3FuturesSchema, 'di1Futures');
module.exports = DI1_Model;