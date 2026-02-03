const express = require('express');
const router = express.Router();
const labAuth = require('../middleware/labAuth');
const {
    createService,
    getServices,
    getMyServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/labServiceController');

// Public/Shared Routes
router.get('/', getServices); // Search & Filter
router.get('/:id', getServiceById);

// Lab Protected Routes
router.get('/my/services', labAuth, getMyServices);
router.post('/', labAuth, createService);
router.put('/:id', labAuth, updateService);
router.delete('/:id', labAuth, deleteService);

module.exports = router;
