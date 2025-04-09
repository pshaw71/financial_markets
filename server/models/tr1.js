const mongoose = require('mongoose');
const dataSchema = require('./date-valueSchema');

const Tr1Model = mongoose.model('Tr1', dataSchema, 'tr1'); // 'tr1' is the collection name
module.exports = Tr1Model;