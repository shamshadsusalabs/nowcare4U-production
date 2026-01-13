const express = require('express');
const { 
  getProgress, 
  updateProgress, 
  resetProgress 
} = require('../controllers/congitivetestController');
const { authenticateToken } = require('../middleware/jwtAuth');

const router = express.Router();

// All cognitive test routes require authentication
router.use(authenticateToken);

// Standardized endpoints
router.get('/progress', getProgress);
router.post('/progress', updateProgress);
router.delete('/progress', resetProgress);

module.exports = router;