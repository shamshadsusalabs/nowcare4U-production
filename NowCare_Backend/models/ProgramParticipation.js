const mongoose = require('mongoose');

// Quiz attempt tracking
const quizAttemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOption: { type: Number, required: true, min: 0, max: 3 },
        isCorrect: { type: Boolean, required: true }
    }],
    score: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    percentage: { type: Number, default: 0 },
    attemptedAt: { type: Date, default: Date.now }
});

// Survey response tracking
const surveyResponseSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    answers: {
        type: [String],
        required: true
    },
    respondedAt: { type: Date, default: Date.now }
});

// Main participation record
const programParticipationSchema = new mongoose.Schema({
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },

    // Participant identification
    participantType: {
        type: String,
        enum: ['user', 'doctor', 'pharmacist'],
        required: true
    },
    participantId: {
        type: String,
        required: true
    },
    participantName: {
        type: String,
        required: true,
        trim: true
    },

    // Completion tracking
    completedContents: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    completedTutorials: [{
        type: mongoose.Schema.Types.ObjectId
    }],

    // Quiz & Survey results
    quizAttempts: [quizAttemptSchema],
    surveyResponses: [surveyResponseSchema],

    // Marks earned per section
    marksEarned: {
        content: { type: Number, default: 0, min: 0 },
        tutorial: { type: Number, default: 0, min: 0 },
        quiz: { type: Number, default: 0, min: 0 },
        survey: { type: Number, default: 0, min: 0 }
    },
    totalMarksEarned: { type: Number, default: 0, min: 0 },

    // Status
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
    },
    completedAt: { type: Date }
}, {
    timestamps: true,
    versionKey: false
});

// One participation per participant per program
programParticipationSchema.index({ programId: 1, participantId: 1 }, { unique: true });
programParticipationSchema.index({ participantType: 1, participantId: 1 });
programParticipationSchema.index({ programId: 1 });

module.exports = mongoose.model('ProgramParticipation', programParticipationSchema);
