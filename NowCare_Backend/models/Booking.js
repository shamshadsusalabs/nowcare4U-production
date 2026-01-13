const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  timeSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'confirmed'
  },
  consultationType: {
    type: String,
    enum: ['online', 'in-person'],
    default: 'online'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ doctorId: 1, appointmentDate: 1 });
bookingSchema.index({ patientPhone: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
