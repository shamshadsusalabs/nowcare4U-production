const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const adminAuth = require('../middleware/adminAuth');

// Public — get survey and submit response
router.get('/:id', surveyController.getSurveyById);
router.post('/submit/:id', surveyController.submitSurveyResponse);

// Public — list all surveys
router.get('/', surveyController.getAllSurveys);

// Admin only
router.post('/', adminAuth, surveyController.createSurvey);
router.put('/:id', adminAuth, surveyController.updateSurvey);
router.delete('/:id', adminAuth, surveyController.deleteSurvey);
router.get('/results/:id', adminAuth, surveyController.getSurveyResults);

module.exports = router;
