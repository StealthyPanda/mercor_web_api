// models/Screenshot.js
const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    index: true
  },
  windowId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  screenshot: {
    type: String, // Base64 encoded image
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
screenshotSchema.index({ employeeId: 1, timestamp: -1 });
screenshotSchema.index({ windowId: 1 });

module.exports = mongoose.model('Screenshot', screenshotSchema);