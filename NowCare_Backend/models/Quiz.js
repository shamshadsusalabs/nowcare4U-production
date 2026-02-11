const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length === 4;
            },
            message: 'Exactly 4 options are required'
        }
    },
    correctAnswer: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        min: 0,
        max: 3
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    questions: {
        type: [quizQuestionSchema],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one question is required'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

quizSchema.index({ title: 'text' });
quizSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Quiz', quizSchema);
