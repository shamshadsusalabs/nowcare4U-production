const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { uploadBlogImage } = require('../middleware/cloudinary');

// Get all blogs
router.get('/getAll', blogController.getAllBlogs);

// Search blogs
router.get('/search', blogController.searchBlogs);

// Get single blog
router.get('/getById/:id', blogController.getBlogById);

// Create new blog (with image upload)
router.post('/add', uploadBlogImage, blogController.createBlog);

// Update blog (with optional image update)
router.put('/updateById/:id', uploadBlogImage, blogController.updateBlog);

// Delete blog
router.delete('/deletById/:id', blogController.deleteBlog);

module.exports = router;