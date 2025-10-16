const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  line: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['running', 'stopped', 'maintenance'],
    default: 'stopped'
  },
  lastHeartbeat: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Machine', machineSchema);