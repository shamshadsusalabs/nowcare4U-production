const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ovulationController');

router.post('/calculate', ctrl.calculateAndSave);
router.get('/records', ctrl.listRecords);
router.delete('/records', ctrl.clearRecords);

module.exports = router;
