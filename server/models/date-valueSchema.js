const mongoose = require('mongoose');

const date_valueSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    required: true,
    index: true
  },
  value: {
    type: Number,
    required: true,
  },
});

date_valueSchema.pre('save', function(next) {
  this.date.setHours(0, 0, 0, 0); // Sets time to midnight
  next();
});

module.exports = date_valueSchema;