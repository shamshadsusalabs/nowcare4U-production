const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { uploadContentFiles } = require('../middleware/cloudinary');
const adminAuth = require('../middleware/adminAuth');

// Public
router.get('/', contentController.getAllContent);
router.get('/:id', contentController.getContentById);

// Admin only
router.post('/', adminAuth, uploadContentFiles, contentController.createContent);
router.put('/:id', adminAuth, uploadContentFiles, contentController.updateContent);
router.delete('/:id', adminAuth, contentController.deleteContent);

module.exports = router;
