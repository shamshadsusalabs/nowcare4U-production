const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const {
  signup,
  login,
  getProfile,
  getDoctors,
  updateDoctorStatus,
  verifyDoctor,
  getDashboardStats,
  getAllBlogs,
  deleteBlog,
  getPharmacists,
  updatePharmacistStatus,
  verifyPharmacist,
} = require('../controllers/adminController');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require admin auth)
router.use(adminAuth);
router.get('/profile', getProfile);
router.get('/dashboard/stats', getDashboardStats);
router.get('/doctors', getDoctors);
router.put('/doctors/:doctorId/status', updateDoctorStatus);
router.put('/doctors/:doctorId/verify', verifyDoctor);
router.get('/blogs', getAllBlogs);
router.delete('/blogs/:blogId', deleteBlog);
router.get('/pharmacists', getPharmacists);
router.put('/pharmacists/:pharmacistId/status', updatePharmacistStatus);
router.put('/pharmacists/:pharmacistId/verify', verifyPharmacist);

module.exports = router;
