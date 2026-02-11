const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const adminAuth = require('../middleware/adminAuth');

// Public — attempt quiz
router.get('/attempt/:id', quizController.getQuizForAttempt);
router.post('/submit/:id', quizController.submitQuiz);

// Public — list quizzes
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);

// Admin only
router.post('/', adminAuth, quizController.createQuiz);
router.put('/:id', adminAuth, quizController.updateQuiz);
router.delete('/:id', adminAuth, quizController.deleteQuiz);

module.exports = router;
