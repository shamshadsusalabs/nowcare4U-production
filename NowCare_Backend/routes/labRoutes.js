const express = require('express');
const router = express.Router();
const labAuth = require('../middleware/labAuth');
const {
    registerLab,
    loginLab,
    getLabProfile,
    updateLabProfile
} = require('../controllers/labController');
const { uploadLabDocs } = require('../middleware/cloudinary'); // Assuming this exists or using general upload

// Public Routes
router.post('/register', registerLab); // Add upload middleware if needed later
router.post('/login', loginLab);

// Protected Routes
router.get('/profile', labAuth, getLabProfile);
router.put('/profile', labAuth, updateLabProfile);

module.exports = router;
