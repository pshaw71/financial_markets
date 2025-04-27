const mongoose = require('mongoose');
const datesSchema = require('./datesSchema');

const COPOM_Model = mongoose.model('copom', datesSchema, 'copom');
module.exports = COPOM_Model;