const Survey = require('../models/Survey');

// Create survey (with 5 questions)
exports.createSurvey = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const survey = await Survey.create({ title, questions });
        res.status(201).json({ success: true, data: survey });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all surveys
exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find().sort({ createdAt: -1 }).select('-responses');
        res.status(200).json({ success: true, data: surveys });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single survey (for filling — without responses)
exports.getSurveyById = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).select('-responses');
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found' });
        }
        res.status(200).json({ success: true, data: survey });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit survey response (5 answers)
exports.submitSurveyResponse = async (req, res) => {
    try {
        const { answers } = req.body; // array of 5 answer strings

        if (!answers || answers.length !== 5) {
            return res.status(400).json({ success: false, message: 'Exactly 5 answers are required' });
        }

        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found' });
        }

        survey.responses.push({ answers });
        await survey.save();

        res.status(200).json({ success: true, message: 'Survey response submitted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get survey results (with all responses — admin)
exports.getSurveyResults = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                survey: {
                    _id: survey._id,
                    title: survey.title,
                    questions: survey.questions
                },
                totalResponses: survey.responses.length,
                responses: survey.responses
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update survey
exports.updateSurvey = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const updateData = {};
        if (title) updateData.title = title;
        if (questions) updateData.questions = questions;

        const survey = await Survey.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-responses');
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found' });
        }
        res.status(200).json({ success: true, data: survey });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete survey
exports.deleteSurvey = async (req, res) => {
    try {
        const survey = await Survey.findByIdAndDelete(req.params.id);
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found' });
        }
        res.status(200).json({ success: true, message: 'Survey deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
