const Program = require('../models/Program');
const ProgramParticipation = require('../models/ProgramParticipation');

// ==================== ADMIN: PROGRAM CRUD ====================

// Create a new program
exports.createProgram = async (req, res) => {
    try {
        const { title, description, accessRoles, marks, contents, tutorials, quizzes, surveys } = req.body;

        // Parse JSON fields if sent as strings (for multipart form)
        const parsedContents = typeof contents === 'string' ? JSON.parse(contents) : contents;
        const parsedTutorials = typeof tutorials === 'string' ? JSON.parse(tutorials) : tutorials;
        const parsedQuizzes = typeof quizzes === 'string' ? JSON.parse(quizzes) : quizzes;
        const parsedSurveys = typeof surveys === 'string' ? JSON.parse(surveys) : surveys;
        const parsedMarks = typeof marks === 'string' ? JSON.parse(marks) : marks;
        const parsedRoles = typeof accessRoles === 'string' ? JSON.parse(accessRoles) : accessRoles;

        // Handle file uploads for content items
        if (req.files && req.files.length > 0 && parsedContents) {
            // Files are uploaded with fieldname pattern: content_0, content_1, etc.
            for (const file of req.files) {
                const match = file.fieldname.match(/content_(\d+)/);
                if (match) {
                    const index = parseInt(match[1]);
                    if (parsedContents[index]) {
                        if (!parsedContents[index].files) parsedContents[index].files = [];
                        parsedContents[index].files.push({
                            url: file.path,
                            type: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
                            originalName: file.originalname
                        });
                    }
                }
            }
        }

        const program = await Program.create({
            title,
            description,
            accessRoles: parsedRoles,
            marks: parsedMarks || { content: 0, tutorial: 0, quiz: 0, survey: 0 },
            contents: parsedContents || [],
            tutorials: parsedTutorials || [],
            quizzes: parsedQuizzes || [],
            surveys: parsedSurveys || []
        });

        res.status(201).json({ success: true, data: program });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all programs (admin)
exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find().sort({ createdAt: -1 }).lean();

        // Attach participation count for each program
        const programIds = programs.map(p => p._id);
        const participationCounts = await ProgramParticipation.aggregate([
            { $match: { programId: { $in: programIds } } },
            { $group: { _id: '$programId', count: { $sum: 1 } } }
        ]);

        const countMap = {};
        participationCounts.forEach(p => { countMap[p._id.toString()] = p.count; });

        const result = programs.map(p => ({
            ...p,
            participantCount: countMap[p._id.toString()] || 0
        }));

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single program by ID
exports.getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }
        res.status(200).json({ success: true, data: program });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update program
exports.updateProgram = async (req, res) => {
    try {
        const { title, description, accessRoles, marks, contents, tutorials, quizzes, surveys, isActive } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = isActive;

        if (accessRoles !== undefined) {
            updateData.accessRoles = typeof accessRoles === 'string' ? JSON.parse(accessRoles) : accessRoles;
        }
        if (marks !== undefined) {
            updateData.marks = typeof marks === 'string' ? JSON.parse(marks) : marks;
        }
        if (contents !== undefined) {
            updateData.contents = typeof contents === 'string' ? JSON.parse(contents) : contents;
        }
        if (tutorials !== undefined) {
            updateData.tutorials = typeof tutorials === 'string' ? JSON.parse(tutorials) : tutorials;
        }
        if (quizzes !== undefined) {
            updateData.quizzes = typeof quizzes === 'string' ? JSON.parse(quizzes) : quizzes;
        }
        if (surveys !== undefined) {
            updateData.surveys = typeof surveys === 'string' ? JSON.parse(surveys) : surveys;
        }

        // Handle file uploads for content items
        if (req.files && req.files.length > 0 && updateData.contents) {
            for (const file of req.files) {
                const match = file.fieldname.match(/content_(\d+)/);
                if (match) {
                    const index = parseInt(match[1]);
                    if (updateData.contents[index]) {
                        if (!updateData.contents[index].files) updateData.contents[index].files = [];
                        updateData.contents[index].files.push({
                            url: file.path,
                            type: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
                            originalName: file.originalname
                        });
                    }
                }
            }
        }

        // Recalculate totalMarks if marks changed
        if (updateData.marks) {
            updateData.totalMarks = (updateData.marks.content || 0) +
                (updateData.marks.tutorial || 0) +
                (updateData.marks.quiz || 0) +
                (updateData.marks.survey || 0);
        }

        const program = await Program.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        res.status(200).json({ success: true, data: program });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete program (and all participations)
exports.deleteProgram = async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        // Also clean up all participation records
        await ProgramParticipation.deleteMany({ programId: req.params.id });

        res.status(200).json({ success: true, message: 'Program and all participations deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PUBLIC: PROGRAMS BY ROLE ====================

// Get programs by role (for participants)
exports.getProgramsByRole = async (req, res) => {
    try {
        const { role } = req.params;
        if (!['user', 'doctor', 'pharmacist'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role. Must be user, doctor, or pharmacist' });
        }

        const programs = await Program.find({
            accessRoles: role,
            isActive: true
        }).sort({ createdAt: -1 }).select('-quizzes.questions.correctAnswer');

        res.status(200).json({ success: true, data: programs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PARTICIPATION ====================

// Start/get participation in a program
exports.participateInProgram = async (req, res) => {
    try {
        const { participantType, participantId, participantName } = req.body;

        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        if (!program.accessRoles.includes(participantType)) {
            return res.status(403).json({ success: false, message: 'You do not have access to this program' });
        }

        // Find existing or create new participation
        let participation = await ProgramParticipation.findOne({
            programId: req.params.id,
            participantId
        });

        if (!participation) {
            participation = await ProgramParticipation.create({
                programId: req.params.id,
                participantType,
                participantId,
                participantName
            });
        }

        res.status(200).json({ success: true, data: participation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Mark content item as completed
exports.markContentComplete = async (req, res) => {
    try {
        const { participantId } = req.body;
        const { id: programId, itemId } = req.params;

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const participation = await ProgramParticipation.findOne({ programId, participantId });
        if (!participation) {
            return res.status(404).json({ success: false, message: 'Participation not found. Please join the program first.' });
        }

        // Add to completedContents if not already there
        const contentObjId = itemId;
        if (!participation.completedContents.some(c => c.toString() === contentObjId)) {
            participation.completedContents.push(contentObjId);
        }

        // Calculate content marks: proportional to completion
        const totalContents = program.contents.length;
        if (totalContents > 0) {
            participation.marksEarned.content = Math.round(
                (participation.completedContents.length / totalContents) * program.marks.content
            );
        }

        participation.totalMarksEarned = (participation.marksEarned.content || 0) +
            (participation.marksEarned.tutorial || 0) +
            (participation.marksEarned.quiz || 0) +
            (participation.marksEarned.survey || 0);

        await participation.save();
        res.status(200).json({ success: true, data: participation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Mark tutorial as completed
exports.markTutorialComplete = async (req, res) => {
    try {
        const { participantId } = req.body;
        const { id: programId, itemId } = req.params;

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const participation = await ProgramParticipation.findOne({ programId, participantId });
        if (!participation) {
            return res.status(404).json({ success: false, message: 'Participation not found. Please join the program first.' });
        }

        if (!participation.completedTutorials.some(t => t.toString() === itemId)) {
            participation.completedTutorials.push(itemId);
        }

        // Calculate tutorial marks
        const totalTutorials = program.tutorials.length;
        if (totalTutorials > 0) {
            participation.marksEarned.tutorial = Math.round(
                (participation.completedTutorials.length / totalTutorials) * program.marks.tutorial
            );
        }

        participation.totalMarksEarned = (participation.marksEarned.content || 0) +
            (participation.marksEarned.tutorial || 0) +
            (participation.marksEarned.quiz || 0) +
            (participation.marksEarned.survey || 0);

        await participation.save();
        res.status(200).json({ success: true, data: participation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
    try {
        const { participantId, answers } = req.body; // answers: [{ questionId, selectedOption }]
        const { id: programId, quizId } = req.params;

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const quiz = program.quizzes.id(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found in this program' });
        }

        const participation = await ProgramParticipation.findOne({ programId, participantId });
        if (!participation) {
            return res.status(404).json({ success: false, message: 'Participation not found. Please join the program first.' });
        }

        // Grade quiz
        let score = 0;
        const totalQuestions = quiz.questions.length;
        const gradedAnswers = [];

        for (const answer of answers) {
            const question = quiz.questions.id(answer.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === answer.selectedOption;
                if (isCorrect) score++;
                gradedAnswers.push({
                    questionId: answer.questionId,
                    selectedOption: answer.selectedOption,
                    isCorrect
                });
            }
        }

        const percentage = Math.round((score / totalQuestions) * 100);

        // Add quiz attempt
        participation.quizAttempts.push({
            quizId,
            answers: gradedAnswers,
            score,
            totalQuestions,
            percentage
        });

        // Calculate quiz marks: best attempt percentage × quiz marks
        const totalQuizzes = program.quizzes.length;
        if (totalQuizzes > 0) {
            // Get best score for each quiz
            const quizScores = {};
            for (const attempt of participation.quizAttempts) {
                const key = attempt.quizId.toString();
                if (!quizScores[key] || attempt.percentage > quizScores[key]) {
                    quizScores[key] = attempt.percentage;
                }
            }
            // Average across all quizzes
            const avgPercentage = Object.values(quizScores).reduce((a, b) => a + b, 0) / totalQuizzes;
            participation.marksEarned.quiz = Math.round((avgPercentage / 100) * program.marks.quiz);
        }

        participation.totalMarksEarned = (participation.marksEarned.content || 0) +
            (participation.marksEarned.tutorial || 0) +
            (participation.marksEarned.quiz || 0) +
            (participation.marksEarned.survey || 0);

        await participation.save();

        res.status(200).json({
            success: true,
            data: {
                score,
                totalQuestions,
                percentage,
                gradedAnswers,
                participation
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Submit survey response
exports.submitSurveyResponse = async (req, res) => {
    try {
        const { participantId, answers } = req.body; // answers: [String]
        const { id: programId, surveyId } = req.params;

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const survey = program.surveys.id(surveyId);
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found in this program' });
        }

        const participation = await ProgramParticipation.findOne({ programId, participantId });
        if (!participation) {
            return res.status(404).json({ success: false, message: 'Participation not found. Please join the program first.' });
        }

        // Add survey response
        participation.surveyResponses.push({
            surveyId,
            answers
        });

        // Calculate survey marks: proportional to surveys completed
        const totalSurveys = program.surveys.length;
        if (totalSurveys > 0) {
            const completedSurveyIds = new Set(participation.surveyResponses.map(r => r.surveyId.toString()));
            participation.marksEarned.survey = Math.round(
                (completedSurveyIds.size / totalSurveys) * program.marks.survey
            );
        }

        participation.totalMarksEarned = (participation.marksEarned.content || 0) +
            (participation.marksEarned.tutorial || 0) +
            (participation.marksEarned.quiz || 0) +
            (participation.marksEarned.survey || 0);

        await participation.save();
        res.status(200).json({ success: true, data: participation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get participant's own progress
exports.getParticipationDetails = async (req, res) => {
    try {
        const { participantId } = req.query;
        const participation = await ProgramParticipation.findOne({
            programId: req.params.id,
            participantId
        }).populate('programId');

        if (!participation) {
            return res.status(404).json({ success: false, message: 'Participation not found' });
        }

        res.status(200).json({ success: true, data: participation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get all participations for a program (results table)
exports.getAllParticipations = async (req, res) => {
    try {
        const programId = req.params.id;

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const participations = await ProgramParticipation.find({ programId })
            .sort({ totalMarksEarned: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                program: {
                    _id: program._id,
                    title: program.title,
                    totalMarks: program.totalMarks,
                    marks: program.marks,
                    contentCount: program.contents.length,
                    tutorialCount: program.tutorials.length,
                    quizCount: program.quizzes.length,
                    surveyCount: program.surveys.length
                },
                totalParticipants: participations.length,
                participations
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
