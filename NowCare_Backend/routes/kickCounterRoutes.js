const express = require('express');
const router = express.Router();
const {
  getKickData,
  saveKickData,
  getNotificationData,
  saveNotificationData,
  deleteNotificationData,
  sharePdf,
  clearKickData
} = require('../controllers/kickCounterController');
const { authenticateToken } = require('../middleware/jwtAuth');

// All routes require authentication
router.use(authenticateToken);

// Kick counter data routes
router.get('/data', getKickData);
router.post('/data', saveKickData);
router.delete('/data', clearKickData);

// Notification routes
router.get('/notifications', getNotificationData);
router.post('/notifications', saveNotificationData);
router.delete('/notifications', deleteNotificationData);

// PDF sharing route
router.post('/share-pdf', sharePdf);

module.exports = router;
