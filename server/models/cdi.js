const mongoose = require('mongoose');
const dataSchema = require('./date_valueSchema');

const CdiModel = mongoose.model('Cdi', dataSchema, 'cdi'); // 'cdi' is the collection name
module.exports = CdiModel;