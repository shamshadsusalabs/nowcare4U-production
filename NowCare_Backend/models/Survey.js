const mongoose = require('mongoose');

const surveyQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true
    }
});

const surveyResponseSchema = new mongoose.Schema({
    answers: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length === 5;
            },
            message: 'Exactly 5 answers are required'
        }
    },
    respondedAt: {
        type: Date,
        default: Date.now
    }
});

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Survey title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    questions: {
        type: [surveyQuestionSchema],
        required: true,
        validate: {
            validator: function (v) {
                return v.length === 5;
            },
            message: 'Exactly 5 questions are required'
        }
    },
    responses: [surveyResponseSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

surveySchema.index({ title: 'text' });
surveySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Survey', surveySchema);
