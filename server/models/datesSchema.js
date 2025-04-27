const mongoose = require('mongoose');

const datesSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    required: true
  },
});

datesSchema.pre('save', function(next) {
  this.date.setHours(0, 0, 0, 0); // Sets time to midnight
  next();
});

module.exports = datesSchema;