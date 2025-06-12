const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  expiryDate: {
    type: Date,
    required: true,
  },
  expiryCode: {
    type: String,
    required: true,
  },
  outstandingContracts: {
    type: Number,
    required: true,
  },
  executedTrades: {
    type: Number,
    required: true,
  },
  contractsTraded: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  previousSettlement: {
    type: Number,
    required: true,
  },
  openingPrice: {
    type: Number,
    required: true,
  },
  minimumPrice: {
    type: Number,
    required: true,
  },
  maximumPrice: {
    type: Number,
    required: true,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
  lastPrice: {
    type: Number,
    required: true,
  },
  settlementPrice: {
    type: Number,
    required: true,
  },
  variationInPoints: {
    type: Number,
    required: true,
  },
  lastBuyOrder: {
    type: Number,
    required: false,
  },
  lastSellOrder: {
    type: Number,
    required: false,
  },
});

const b3FuturesSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    required: true,
  },
  contracts: [contractSchema],
});

// b3FuturesSchema.pre('save', function(next) {
//   this.date.setHours(0, 0, 0, 0); // Sets time to midnight
//   next();
// });

module.exports = b3FuturesSchema;