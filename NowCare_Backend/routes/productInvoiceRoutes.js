const express = require('express');
const router = express.Router();
const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoiceStatus
} = require('../controllers/productInvoiceController');
const pharmacistAuth = require('../middleware/pharmacistAuth');

// Protect all routes
router.use(pharmacistAuth);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id/status', updateInvoiceStatus);

module.exports = router;
