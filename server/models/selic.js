const mongoose = require('mongoose');
const dataSchema = require('./date-valueSchema');

const SelicModel = mongoose.model('Selic', dataSchema, 'selic'); // 'selic' is the collection name
module.exports = SelicModel;