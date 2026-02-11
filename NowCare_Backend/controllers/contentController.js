const Content = require('../models/Content');

// Create content
exports.createContent = async (req, res) => {
    try {
        const { title } = req.body;

        // Process uploaded files
        const files = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const isPDF = file.mimetype === 'application/pdf';
                files.push({
                    url: file.path,
                    type: isPDF ? 'pdf' : 'image',
                    originalName: file.originalname
                });
            }
        }

        const content = await Content.create({ title, files });
        res.status(201).json({ success: true, data: content });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all content
exports.getAllContent = async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single content
exports.getContentById = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update content
exports.updateContent = async (req, res) => {
    try {
        const { title } = req.body;
        const updateData = {};
        if (title) updateData.title = title;

        // If new files uploaded, add them
        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(file => ({
                url: file.path,
                type: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
                originalName: file.originalname
            }));
            updateData.files = newFiles;
        }

        const content = await Content.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete content
exports.deleteContent = async (req, res) => {
    try {
        const content = await Content.findByIdAndDelete(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.status(200).json({ success: true, message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
