const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    files: [{
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'pdf'], required: true },
        originalName: { type: String }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

contentSchema.index({ title: 'text' });
contentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);
