const mongoose = require('mongoose');

const kickEntrySchema = new mongoose.Schema({
  display: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const notificationSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const kickCounterSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ''
  },
  count: [kickEntrySchema],
  notifications: [notificationSchema],
  setNotification: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('KickCounter', kickCounterSchema);
