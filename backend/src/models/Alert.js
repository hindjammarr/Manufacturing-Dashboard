const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);