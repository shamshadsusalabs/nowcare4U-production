const Tutorial = require('../models/Tutorial');

// Create tutorial
exports.createTutorial = async (req, res) => {
    try {
        const { title, description, youtubeLink } = req.body;
        const tutorial = await Tutorial.create({ title, description, youtubeLink });
        res.status(201).json({ success: true, data: tutorial });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all tutorials
exports.getAllTutorials = async (req, res) => {
    try {
        const tutorials = await Tutorial.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tutorials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single tutorial
exports.getTutorialById = async (req, res) => {
    try {
        const tutorial = await Tutorial.findById(req.params.id);
        if (!tutorial) {
            return res.status(404).json({ success: false, message: 'Tutorial not found' });
        }
        res.status(200).json({ success: true, data: tutorial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update tutorial
exports.updateTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tutorial) {
            return res.status(404).json({ success: false, message: 'Tutorial not found' });
        }
        res.status(200).json({ success: true, data: tutorial });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete tutorial
exports.deleteTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
        if (!tutorial) {
            return res.status(404).json({ success: false, message: 'Tutorial not found' });
        }
        res.status(200).json({ success: true, message: 'Tutorial deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
