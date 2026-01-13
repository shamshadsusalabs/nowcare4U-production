const express = require('express');
const { authenticateToken } = require('../middleware/jwtAuth');
const {
  getRecord,
  initializeBaseline,
  addEntry,
  resetAll,
} = require('../controllers/pregnancyWeightController');

const router = express.Router();

router.use(authenticateToken);

// Get full record (baseline, curves, my entries)
router.get('/record', getRecord);

// Initialize baseline with pre-pregnancy weight and height (creates curves and first entry at week 0)
router.post('/baseline', initializeBaseline);

// Add an entry { week, weight }
router.post('/entry', addEntry);

// Reset/delete entire record for the user
router.delete('/record', resetAll);

module.exports = router;
