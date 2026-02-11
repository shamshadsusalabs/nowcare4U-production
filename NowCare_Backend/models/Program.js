const mongoose = require('mongoose');

// ============ Sub-Schemas for embedded items ============

const contentFileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'pdf'], required: true },
    originalName: { type: String }
}, { _id: false });

const contentItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    files: [contentFileSchema]
});

const tutorialItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    youtubeLink: { type: String, required: true, trim: true }
});

const quizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: v => v.length === 4,
            message: 'Exactly 4 options are required'
        }
    },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 }
});

const quizItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    questions: {
        type: [quizQuestionSchema],
        required: true,
        validate: {
            validator: v => v.length > 0,
            message: 'At least one question is required'
        }
    }
});

const surveyQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true }
});

const surveyItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    questions: {
        type: [surveyQuestionSchema],
        required: true,
        validate: {
            validator: v => v.length > 0,
            message: 'At least one question is required'
        }
    }
});

// ============ Main Program Schema ============

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Program title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },

    // Who can access this program
    accessRoles: {
        type: [String],
        enum: ['user', 'doctor', 'pharmacist'],
        required: [true, 'At least one access role is required'],
        validate: {
            validator: v => v.length > 0,
            message: 'At least one access role must be selected'
        }
    },

    // Marks configuration per section
    marks: {
        content: { type: Number, default: 0, min: 0 },
        tutorial: { type: Number, default: 0, min: 0 },
        quiz: { type: Number, default: 0, min: 0 },
        survey: { type: Number, default: 0, min: 0 }
    },
    totalMarks: { type: Number, default: 0, min: 0 },

    // Embedded items
    contents: [contentItemSchema],
    tutorials: [tutorialItemSchema],
    quizzes: [quizItemSchema],
    surveys: [surveyItemSchema],

    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

// Auto-calculate totalMarks before saving
programSchema.pre('save', function (next) {
    this.totalMarks = (this.marks.content || 0) +
        (this.marks.tutorial || 0) +
        (this.marks.quiz || 0) +
        (this.marks.survey || 0);
    next();
});

programSchema.index({ title: 'text', description: 'text' });
programSchema.index({ accessRoles: 1 });
programSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Program', programSchema);
