const express = require('express');
const router = express.Router();
const pharmacistAuth = require('../middleware/pharmacistAuth');
const { uploadPharmacistDocs } = require('../middleware/cloudinary');
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getAllPharmacists
} = require('../controllers/pharmacistController');

// Public routes
router.post('/signup', uploadPharmacistDocs, signup);
router.post('/login', login);

// Protected routes (require pharmacist auth)
router.get('/profile', pharmacistAuth, getProfile);
router.put('/profile', pharmacistAuth, uploadPharmacistDocs, updateProfile);

// Admin routes (for getting all pharmacists)
router.get('/all', getAllPharmacists);

module.exports = router;
