const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const { uploadPharmacistDocs, uploadLabDocs } = require('../middleware/cloudinary');
const {
  signup,
  login,
  getProfile,
  getDoctors,
  createDoctor,
  updateDoctorStatus,
  verifyDoctor,
  getDashboardStats,
  getAllBlogs,
  deleteBlog,
  getPharmacists,
  createPharmacist,
  updatePharmacistStatus,
  verifyPharmacist,
  getLabs,
  createLab,
  updateLabStatus,
  verifyLab,
  getLabServices,
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
router.post('/doctors', createDoctor);
router.put('/doctors/:doctorId/status', updateDoctorStatus);
router.put('/doctors/:doctorId/verify', verifyDoctor);
router.get('/blogs', getAllBlogs);
router.delete('/blogs/:blogId', deleteBlog);
router.get('/pharmacists', getPharmacists);
router.post('/pharmacists', uploadPharmacistDocs, createPharmacist);
router.put('/pharmacists/:pharmacistId/status', updatePharmacistStatus);
router.put('/pharmacists/:pharmacistId/verify', verifyPharmacist);
router.get('/labs', getLabs);
router.post('/labs', uploadLabDocs, createLab);
router.put('/labs/:labId/status', updateLabStatus);
router.put('/labs/:labId/verify', verifyLab);
router.get('/labs/:labId/services', getLabServices);

module.exports = router;
