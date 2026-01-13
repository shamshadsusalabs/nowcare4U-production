const express = require('express');
const router = express.Router();
const pharmacistAuth = require('../middleware/pharmacistAuth');
const {
  signup,
  login,
  getProfile,
  getAllPharmacists
} = require('../controllers/pharmacistController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require pharmacist auth)
router.get('/profile', pharmacistAuth, getProfile);

// Admin routes (for getting all pharmacists)
router.get('/all', getAllPharmacists);

module.exports = router;
