const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    youtubeLink: {
        type: String,
        required: [true, 'YouTube link is required'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

tutorialSchema.index({ title: 'text', description: 'text' });
tutorialSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Tutorial', tutorialSchema);
