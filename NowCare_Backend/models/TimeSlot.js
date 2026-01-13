const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true // Format: "HH:MM" (24-hour format)
  },
  endTime: {
    type: String,
    required: true // Format: "HH:MM" (24-hour format)
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique slots per doctor per date/time
timeSlotSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
