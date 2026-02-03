const express = require('express');
const router = express.Router();
const pharmacistAuth = require('../middleware/pharmacistAuth');
const { uploadProductImages } = require('../middleware/cloudinary');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Public/Shared Routes
router.get('/', getProducts); // Can filter by ?pharmacistId=...
router.get('/:id', getProductById);

// Pharmacist Protected Routes
// Create Product
router.post('/', pharmacistAuth, uploadProductImages, createProduct);

// Update Product (Ownership check in controller)
router.put('/:id', pharmacistAuth, uploadProductImages, updateProduct);

// Delete Product
router.delete('/:id', pharmacistAuth, deleteProduct);

module.exports = router;
