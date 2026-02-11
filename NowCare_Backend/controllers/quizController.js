const Quiz = require('../models/Quiz');

// Create quiz
exports.createQuiz = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const quiz = await Quiz.create({ title, questions });
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single quiz (without correct answers — for attempting)
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get quiz for attempt (hide correct answers)
exports.getQuizForAttempt = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).lean();
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // Remove correct answers from response
        const sanitized = {
            ...quiz,
            questions: quiz.questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options
            }))
        };

        res.status(200).json({ success: true, data: sanitized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit quiz answers and get score
exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // array of { questionId, selectedOption (0-3) }
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        let score = 0;
        const totalQuestions = quiz.questions.length;
        const results = [];

        for (const answer of answers) {
            const question = quiz.questions.id(answer.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === answer.selectedOption;
                if (isCorrect) score++;
                results.push({
                    questionId: question._id,
                    question: question.question,
                    selectedOption: answer.selectedOption,
                    correctAnswer: question.correctAnswer,
                    isCorrect
                });
            }
        }

        res.status(200).json({
            success: true,
            data: {
                score,
                totalQuestions,
                percentage: Math.round((score / totalQuestions) * 100),
                results
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
