const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientBookings,
  cancelBooking
} = require('../controllers/bookingController');

// Public booking routes
router.post('/', bookAppointment);
router.get('/patient/:phone', getPatientBookings);
router.put('/:bookingId/cancel', cancelBooking);

module.exports = router;
