const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile
} = require('../controllers/doctorController');
const {
  createTimeSlots,
  getDoctorTimeSlots,
  getAvailableSlots,
  updateSlotAvailability
} = require('../controllers/timeSlotController');
const {
  getDoctorBookings
} = require('../controllers/bookingController');
const { authenticateDoctor } = require('../middleware/doctorAuth');

// Authentication routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);

// Protected doctor routes
router.get('/profile', authenticateDoctor, getDoctorProfile);
router.put('/profile', authenticateDoctor, updateDoctorProfile);

// Time slot management
router.post('/time-slots', authenticateDoctor, createTimeSlots);
router.get('/time-slots', authenticateDoctor, getDoctorTimeSlots);
router.put('/time-slots/:slotId', authenticateDoctor, updateSlotAvailability);

// Doctor bookings
router.get('/bookings', authenticateDoctor, getDoctorBookings);

// Public routes
router.get('/:doctorId/available-slots', getAvailableSlots);

module.exports = router;
