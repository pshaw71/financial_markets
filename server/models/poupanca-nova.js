const mongoose = require('mongoose');
const dataSchema = require('./date-valueSchema');

const PoupancaNovaModel = mongoose.model('PoupancaNova', dataSchema, 'poupanca-nova'); // 'poupanca-nova' is the collection name
module.exports = PoupancaNovaModel;