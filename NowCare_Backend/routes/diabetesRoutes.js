const express = require('express');
const { authenticateToken } = require('../middleware/jwtAuth');
const {
  listRecords,
  createRecord,
  deleteRecord,
  clearAll
} = require('../controllers/diabetesController');

const router = express.Router();

// Require auth for all diabetes endpoints
router.use(authenticateToken);

router.get('/records', listRecords);
router.post('/records', createRecord);
router.delete('/records/:id', deleteRecord);
router.delete('/records', clearAll);

module.exports = router;
