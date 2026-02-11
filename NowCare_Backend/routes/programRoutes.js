const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { uploadContentFiles } = require('../middleware/cloudinary');
const {
    createProgram,
    getAllPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
    getProgramsByRole,
    participateInProgram,
    markContentComplete,
    markTutorialComplete,
    submitQuizAttempt,
    submitSurveyResponse,
    getParticipationDetails,
    getAllParticipations
} = require('../controllers/programController');

// ==================== Admin Routes (protected) ====================
router.post('/', adminAuth, uploadContentFiles, createProgram);
router.get('/admin/all', adminAuth, getAllPrograms);
router.get('/admin/:id', adminAuth, getProgramById);
router.put('/:id', adminAuth, uploadContentFiles, updateProgram);
router.delete('/:id', adminAuth, deleteProgram);
router.get('/:id/participations', adminAuth, getAllParticipations);

// ==================== Public/Participant Routes ====================
router.get('/role/:role', getProgramsByRole);
router.post('/:id/participate', participateInProgram);
router.post('/:id/content/:itemId/complete', markContentComplete);
router.post('/:id/tutorial/:itemId/complete', markTutorialComplete);
router.post('/:id/quiz/:quizId/submit', submitQuizAttempt);
router.post('/:id/survey/:surveyId/submit', submitSurveyResponse);
router.get('/:id/my-progress', getParticipationDetails);

module.exports = router;
