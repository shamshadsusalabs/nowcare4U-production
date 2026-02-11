const express = require('express');
const router = express.Router();
const tutorialController = require('../controllers/tutorialController');
const adminAuth = require('../middleware/adminAuth');

// Public
router.get('/', tutorialController.getAllTutorials);
router.get('/:id', tutorialController.getTutorialById);

// Admin only
router.post('/', adminAuth, tutorialController.createTutorial);
router.put('/:id', adminAuth, tutorialController.updateTutorial);
router.delete('/:id', adminAuth, tutorialController.deleteTutorial);

module.exports = router;
