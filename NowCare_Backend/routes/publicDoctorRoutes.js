const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getSpecialties
} = require('../controllers/publicDoctorController');
const {
  getAvailableSlots
} = require('../controllers/timeSlotController');

// Public routes for doctor listing
router.get('/doctors', getAllDoctors);
router.get('/doctors/:id', getDoctorById);
router.get('/doctors/:doctorId/available-slots', getAvailableSlots);
router.get('/specialties', getSpecialties);

module.exports = router;
