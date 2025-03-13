const mongoose = require('mongoose');

const transportOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bus', 'metro', 'train'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  route: {
    type: [String],
    required: true
  }
});

const rideHailingOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bike', 'auto', 'car'],
    required: true
  },
  provider: {
    type: String,
    enum: ['uber', 'rapido', 'ola'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  fare: {
    type: Number,
    required: true
  }
});

const routeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  transportOptions: {
    type: [transportOptionSchema],
    required: true
  },
  rideHailingOptions: {
    type: [rideHailingOptionSchema],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Route', routeSchema);
