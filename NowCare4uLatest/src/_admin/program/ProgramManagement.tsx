import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../AdminContext';
import { buildApiUrl } from '../../config/api';
import {
    Plus, Trash2, Edit, X, Users, FileText, Video,
    HelpCircle, ClipboardList, Award, ChevronDown, ChevronUp,
    BookOpen, Save, Upload
} from 'lucide-react';

// ==================== TYPES ====================

interface ContentFile {
    url: string;
    type: 'image' | 'pdf';
    originalName?: string;
}

interface ContentItem {
    _id?: string;
    title: string;
    files: ContentFile[];
}

interface TutorialItem {
    _id?: string;
    title: string;
    description: string;
    youtubeLink: string;
}

interface QuizQuestion {
    _id?: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizItem {
    _id?: string;
    title: string;
    questions: QuizQuestion[];
}

interface SurveyQuestion {
    _id?: string;
    question: string;
}

interface SurveyItem {
    _id?: string;
    title: string;
    questions: SurveyQuestion[];
}

interface ProgramMarks {
    content: number;
    tutorial: number;
    quiz: number;
    survey: number;
}

interface Program {
    _id: string;
    title: string;
    description: string;
    accessRoles: string[];
    marks: ProgramMarks;
    totalMarks: number;
    contents: ContentItem[];
    tutorials: TutorialItem[];
    quizzes: QuizItem[];
    surveys: SurveyItem[];
    isActive: boolean;
    participantCount?: number;
    createdAt: string;
}

interface Participation {
    _id: string;
    participantType: string;
    participantId: string;
    participantName: string;
    completedContents: string[];
    completedTutorials: string[];
    quizAttempts: { quizId: string; score: number; totalQuestions: number; percentage: number }[];
    surveyResponses: { surveyId: string }[];
    marksEarned: ProgramMarks;
    totalMarksEarned: number;
    status: string;
    createdAt: string;
}

// ==================== COMPONENT ====================

export default function ProgramManagement() {
    const { token } = useAdminAuth();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'content' | 'tutorials' | 'quizzes' | 'surveys'>('info');
    const [showResults, setShowResults] = useState<string | null>(null);
    const [participations, setParticipations] = useState<Participation[]>([]);
    const [resultsProgram, setResultsProgram] = useState<any>(null);
    const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formRoles, setFormRoles] = useState<string[]>([]);
    const [formMarks, setFormMarks] = useState<ProgramMarks>({ content: 5, tutorial: 10, quiz: 20, survey: 5 });
    const [formContents, setFormContents] = useState<ContentItem[]>([]);
    const [formTutorials, setFormTutorials] = useState<TutorialItem[]>([]);
    const [formQuizzes, setFormQuizzes] = useState<QuizItem[]>([]);
    const [formSurveys, setFormSurveys] = useState<SurveyItem[]>([]);
    const [contentFiles, setContentFiles] = useState<Record<number, File[]>>({});
    const [saving, setSaving] = useState(false);

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const authHeaders = { 'Authorization': `Bearer ${token}` };

    // ==================== DATA FETCHING ====================

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(buildApiUrl('programs/admin/all'), { headers });
            const data = await res.json();
            if (data.success) setPrograms(data.data);
        } catch (err) {
            console.error('Failed to fetch programs:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

    const fetchResults = async (programId: string) => {
        try {
            const res = await fetch(buildApiUrl(`programs/${programId}/participations`), { headers });
            const data = await res.json();
            if (data.success) {
                setParticipations(data.data.participations);
                setResultsProgram(data.data.program);
                setShowResults(programId);
            }
        } catch (err) {
            console.error('Failed to fetch results:', err);
        }
    };

    // ==================== FORM HELPERS ====================

    const resetForm = () => {
        setFormTitle('');
        setFormDescription('');
        setFormRoles([]);
        setFormMarks({ content: 5, tutorial: 10, quiz: 20, survey: 5 });
        setFormContents([]);
        setFormTutorials([]);
        setFormQuizzes([]);
        setFormSurveys([]);
        setContentFiles({});
        setEditingProgram(null);
        setActiveTab('info');
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (program: Program) => {
        setEditingProgram(program);
        setFormTitle(program.title);
        setFormDescription(program.description);
        setFormRoles([...program.accessRoles]);
        setFormMarks({ ...program.marks });
        setFormContents(program.contents.map(c => ({ ...c, files: [...c.files] })));
        setFormTutorials(program.tutorials.map(t => ({ ...t })));
        setFormQuizzes(program.quizzes.map(q => ({ ...q, questions: q.questions.map(qq => ({ ...qq, options: [...qq.options] })) })));
        setFormSurveys(program.surveys.map(s => ({ ...s, questions: s.questions.map(sq => ({ ...sq })) })));
        setActiveTab('info');
        setShowModal(true);
    };

    const toggleRole = (role: string) => {
        setFormRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    };

    // ==================== SAVE ====================

    const handleSave = async () => {
        if (!formTitle.trim()) return alert('Program title is required');
        if (formRoles.length === 0) return alert('At least one access role must be selected');

        setSaving(true);
        try {
            const hasFiles = Object.values(contentFiles).some(files => files.length > 0);

            const url = editingProgram
                ? buildApiUrl(`programs/${editingProgram._id}`)
                : buildApiUrl('programs');

            let res;

            if (hasFiles) {
                // Use FormData when files are present
                const formData = new FormData();
                formData.append('title', formTitle);
                formData.append('description', formDescription);
                formData.append('accessRoles', JSON.stringify(formRoles));
                formData.append('marks', JSON.stringify(formMarks));
                formData.append('contents', JSON.stringify(formContents));
                formData.append('tutorials', JSON.stringify(formTutorials));
                formData.append('quizzes', JSON.stringify(formQuizzes));
                formData.append('surveys', JSON.stringify(formSurveys));

                // Append files with content index pattern: files (field name used by multer)
                Object.entries(contentFiles).forEach(([_index, files]) => {
                    files.forEach(file => {
                        formData.append('files', file);
                    });
                });

                res = await fetch(url, {
                    method: editingProgram ? 'PUT' : 'POST',
                    headers: authHeaders,
                    body: formData
                });
            } else {
                // Use JSON when no files
                res = await fetch(url, {
                    method: editingProgram ? 'PUT' : 'POST',
                    headers,
                    body: JSON.stringify({
                        title: formTitle,
                        description: formDescription,
                        accessRoles: formRoles,
                        marks: formMarks,
                        contents: formContents,
                        tutorials: formTutorials,
                        quizzes: formQuizzes,
                        surveys: formSurveys
                    })
                });
            }

            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                resetForm();
                fetchPrograms();
            } else {
                alert(data.message || 'Failed to save program');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save program');
        } finally {
            setSaving(false);
        }
    };

    // ==================== DELETE ====================

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete the program and all participation records.')) return;
        try {
            const res = await fetch(buildApiUrl(`programs/${id}`), { method: 'DELETE', headers });
            const data = await res.json();
            if (data.success) fetchPrograms();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    // ==================== CONTENT MANAGEMENT ====================

    const addContent = () => setFormContents([...formContents, { title: '', files: [] }]);
    const removeContent = (i: number) => {
        setFormContents(formContents.filter((_, idx) => idx !== i));
        // Clean up associated files
        const newFiles = { ...contentFiles };
        delete newFiles[i];
        // Re-index remaining files
        const reIndexed: Record<number, File[]> = {};
        Object.entries(newFiles).forEach(([key, val]) => {
            const k = parseInt(key);
            reIndexed[k > i ? k - 1 : k] = val;
        });
        setContentFiles(reIndexed);
    };
    const updateContentTitle = (i: number, title: string) => {
        const updated = [...formContents];
        updated[i] = { ...updated[i], title };
        setFormContents(updated);
    };
    const handleContentFileChange = (contentIndex: number, newFiles: FileList | null) => {
        if (!newFiles) return;
        const existing = contentFiles[contentIndex] || [];
        setContentFiles({ ...contentFiles, [contentIndex]: [...existing, ...Array.from(newFiles)] });
    };
    const removeContentFile = (contentIndex: number, fileIndex: number) => {
        const updated = { ...contentFiles };
        updated[contentIndex] = updated[contentIndex].filter((_, idx) => idx !== fileIndex);
        if (updated[contentIndex].length === 0) delete updated[contentIndex];
        setContentFiles(updated);
    };
    const removeExistingContentFile = (contentIndex: number, fileIndex: number) => {
        const updated = [...formContents];
        updated[contentIndex] = {
            ...updated[contentIndex],
            files: updated[contentIndex].files.filter((_, idx) => idx !== fileIndex)
        };
        setFormContents(updated);
    };

    // ==================== TUTORIAL MANAGEMENT ====================

    const addTutorial = () => setFormTutorials([...formTutorials, { title: '', description: '', youtubeLink: '' }]);
    const removeTutorial = (i: number) => setFormTutorials(formTutorials.filter((_, idx) => idx !== i));
    const updateTutorial = (i: number, field: keyof TutorialItem, value: string) => {
        const updated = [...formTutorials];
        updated[i] = { ...updated[i], [field]: value };
        setFormTutorials(updated);
    };

    // ==================== QUIZ MANAGEMENT ====================

    const addQuiz = () => setFormQuizzes([...formQuizzes, { title: '', questions: [] }]);
    const removeQuiz = (i: number) => setFormQuizzes(formQuizzes.filter((_, idx) => idx !== i));
    const updateQuizTitle = (i: number, title: string) => {
        const updated = [...formQuizzes];
        updated[i] = { ...updated[i], title };
        setFormQuizzes(updated);
    };
    const addQuizQuestion = (quizIndex: number) => {
        const updated = [...formQuizzes];
        updated[quizIndex] = {
            ...updated[quizIndex],
            questions: [...updated[quizIndex].questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
        };
        setFormQuizzes(updated);
    };
    const removeQuizQuestion = (quizIndex: number, qIndex: number) => {
        const updated = [...formQuizzes];
        updated[quizIndex] = {
            ...updated[quizIndex],
            questions: updated[quizIndex].questions.filter((_, idx) => idx !== qIndex)
        };
        setFormQuizzes(updated);
    };
    const updateQuizQuestion = (quizIndex: number, qIndex: number, field: string, value: any) => {
        const updated = [...formQuizzes];
        const questions = [...updated[quizIndex].questions];
        questions[qIndex] = { ...questions[qIndex], [field]: value };
        updated[quizIndex] = { ...updated[quizIndex], questions };
        setFormQuizzes(updated);
    };
    const updateQuizOption = (quizIndex: number, qIndex: number, optIndex: number, value: string) => {
        const updated = [...formQuizzes];
        const questions = [...updated[quizIndex].questions];
        const options = [...questions[qIndex].options];
        options[optIndex] = value;
        questions[qIndex] = { ...questions[qIndex], options };
        updated[quizIndex] = { ...updated[quizIndex], questions };
        setFormQuizzes(updated);
    };

    // ==================== SURVEY MANAGEMENT ====================

    const addSurvey = () => setFormSurveys([...formSurveys, { title: '', questions: [] }]);
    const removeSurvey = (i: number) => setFormSurveys(formSurveys.filter((_, idx) => idx !== i));
    const updateSurveyTitle = (i: number, title: string) => {
        const updated = [...formSurveys];
        updated[i] = { ...updated[i], title };
        setFormSurveys(updated);
    };
    const addSurveyQuestion = (surveyIndex: number) => {
        const updated = [...formSurveys];
        updated[surveyIndex] = {
            ...updated[surveyIndex],
            questions: [...updated[surveyIndex].questions, { question: '' }]
        };
        setFormSurveys(updated);
    };
    const removeSurveyQuestion = (surveyIndex: number, qIndex: number) => {
        const updated = [...formSurveys];
        updated[surveyIndex] = {
            ...updated[surveyIndex],
            questions: updated[surveyIndex].questions.filter((_, idx) => idx !== qIndex)
        };
        setFormSurveys(updated);
    };
    const updateSurveyQuestion = (surveyIndex: number, qIndex: number, value: string) => {
        const updated = [...formSurveys];
        const questions = [...updated[surveyIndex].questions];
        questions[qIndex] = { ...questions[qIndex], question: value };
        updated[surveyIndex] = { ...updated[surveyIndex], questions };
        setFormSurveys(updated);
    };

    // ==================== ROLE BADGE ====================

    const roleBadge = (role: string) => {
        const colors: Record<string, string> = {
            user: 'bg-blue-100 text-blue-800',
            doctor: 'bg-green-100 text-green-800',
            pharmacist: 'bg-purple-100 text-purple-800'
        };
        return (
            <span key={role} className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    // ==================== RESULTS VIEW ====================

    if (showResults && resultsProgram) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">📊 Results: {resultsProgram.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Total Marks: {resultsProgram.totalMarks} | Participants: {participations.length}
                        </p>
                    </div>
                    <button onClick={() => setShowResults(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        ← Back to Programs
                    </button>
                </div>

                {/* Marks breakdown */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Content', marks: resultsProgram.marks.content, count: resultsProgram.contentCount, icon: '📄', color: 'blue' },
                        { label: 'Tutorial', marks: resultsProgram.marks.tutorial, count: resultsProgram.tutorialCount, icon: '🎥', color: 'green' },
                        { label: 'Quiz', marks: resultsProgram.marks.quiz, count: resultsProgram.quizCount, icon: '❓', color: 'orange' },
                        { label: 'Survey', marks: resultsProgram.marks.survey, count: resultsProgram.surveyCount, icon: '📋', color: 'purple' },
                    ].map(item => (
                        <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                            <div className="text-2xl mb-1">{item.icon}</div>
                            <div className="text-sm font-medium text-gray-600">{item.label}</div>
                            <div className="text-lg font-bold text-gray-900">{item.marks} marks</div>
                            <div className="text-xs text-gray-400">{item.count} items</div>
                        </div>
                    ))}
                </div>

                {/* Participants table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Participant</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Content</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Tutorial</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Quiz</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Survey</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Total Marks</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {participations.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-8 text-gray-400">No participants yet</td></tr>
                                ) : participations.map(p => (
                                    <tr key={p._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{p.participantName}</td>
                                        <td className="px-4 py-3">{roleBadge(p.participantType)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {p.completedContents.length}/{resultsProgram.contentCount}
                                            <span className="text-gray-400 text-xs ml-1">({p.marksEarned.content}m)</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {p.completedTutorials.length}/{resultsProgram.tutorialCount}
                                            <span className="text-gray-400 text-xs ml-1">({p.marksEarned.tutorial}m)</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {p.quizAttempts.length > 0
                                                ? `${Math.max(...p.quizAttempts.map(a => a.percentage))}%`
                                                : '—'}
                                            <span className="text-gray-400 text-xs ml-1">({p.marksEarned.quiz}m)</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {p.surveyResponses.length}/{resultsProgram.surveyCount}
                                            <span className="text-gray-400 text-xs ml-1">({p.marksEarned.survey}m)</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-bold text-blue-700">{p.totalMarksEarned}</span>
                                            <span className="text-gray-400">/{resultsProgram.totalMarks}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {p.status === 'completed' ? 'Completed' : 'In Progress'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== MAIN VIEW ====================

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-blue-600" /> Program Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Create and manage programs with content, tutorials, quizzes & surveys</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Create Program
                </button>
            </div>

            {/* Programs List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                    <p className="text-gray-500">Loading programs...</p>
                </div>
            ) : programs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No programs created yet</p>
                    <p className="text-gray-400 text-sm mt-1">Click "Create Program" to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {programs.map(program => (
                        <div key={program._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                                            {!program.isActive && (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inactive</span>
                                            )}
                                        </div>
                                        {program.description && (
                                            <p className="text-sm text-gray-500 mb-3">{program.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {program.accessRoles.map(role => roleBadge(role))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button onClick={() => fetchResults(program._id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Results">
                                            <Award className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setExpandedProgram(expandedProgram === program._id ? null : program._id)}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Details">
                                            {expandedProgram === program._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                        <button onClick={() => openEditModal(program)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(program._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <FileText className="w-4 h-4" /> {program.contents.length} Content
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <Video className="w-4 h-4" /> {program.tutorials.length} Tutorials
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <HelpCircle className="w-4 h-4" /> {program.quizzes.length} Quizzes
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <ClipboardList className="w-4 h-4" /> {program.surveys.length} Surveys
                                    </span>
                                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                                        <Award className="w-4 h-4" /> {program.totalMarks} Total Marks
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <Users className="w-4 h-4" /> {program.participantCount || 0} Participants
                                    </span>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {expandedProgram === program._id && (
                                <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div className="bg-white rounded-lg p-3 border">
                                            <div className="font-semibold text-gray-700 mb-1">📄 Content ({program.marks.content} marks)</div>
                                            {program.contents.length === 0 ? <p className="text-gray-400 text-xs">No content</p> :
                                                program.contents.map((c, i) => <p key={i} className="text-gray-600 text-xs">• {c.title}</p>)}
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border">
                                            <div className="font-semibold text-gray-700 mb-1">🎥 Tutorials ({program.marks.tutorial} marks)</div>
                                            {program.tutorials.length === 0 ? <p className="text-gray-400 text-xs">No tutorials</p> :
                                                program.tutorials.map((t, i) => <p key={i} className="text-gray-600 text-xs">• {t.title}</p>)}
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border">
                                            <div className="font-semibold text-gray-700 mb-1">❓ Quizzes ({program.marks.quiz} marks)</div>
                                            {program.quizzes.length === 0 ? <p className="text-gray-400 text-xs">No quizzes</p> :
                                                program.quizzes.map((q, i) => <p key={i} className="text-gray-600 text-xs">• {q.title} ({q.questions.length} Q)</p>)}
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border">
                                            <div className="font-semibold text-gray-700 mb-1">📋 Surveys ({program.marks.survey} marks)</div>
                                            {program.surveys.length === 0 ? <p className="text-gray-400 text-xs">No surveys</p> :
                                                program.surveys.map((s, i) => <p key={i} className="text-gray-600 text-xs">• {s.title} ({s.questions.length} Q)</p>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ==================== CREATE/EDIT MODAL ==================== */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingProgram ? 'Edit Program' : 'Create New Program'}
                            </h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }}
                                className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b px-6 gap-1">
                            {[
                                { key: 'info', label: 'Basic Info & Roles', icon: '⚙️' },
                                { key: 'content', label: `Content (${formContents.length})`, icon: '📄' },
                                { key: 'tutorials', label: `Tutorials (${formTutorials.length})`, icon: '🎥' },
                                { key: 'quizzes', label: `Quizzes (${formQuizzes.length})`, icon: '❓' },
                                { key: 'surveys', label: `Surveys (${formSurveys.length})`, icon: '📋' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal body */}
                        <div className="flex-1 overflow-y-auto p-6">

                            {/* === INFO TAB === */}
                            {activeTab === 'info' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Program Title *</label>
                                        <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g., Diabetes Awareness for Doctors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                            placeholder="Brief description of the program..." />
                                    </div>

                                    {/* Access Roles */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Access Roles * — Who can access this program?</label>
                                        <div className="flex gap-4">
                                            {['user', 'doctor', 'pharmacist'].map(role => (
                                                <label key={role}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${formRoles.includes(role)
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}>
                                                    <input type="checkbox" checked={formRoles.includes(role)}
                                                        onChange={() => toggleRole(role)} className="rounded" />
                                                    <span className="font-medium capitalize">{role}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Marks Configuration */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Marks Configuration</label>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { key: 'content', label: '📄 Content Marks' },
                                                { key: 'tutorial', label: '🎥 Tutorial Marks' },
                                                { key: 'quiz', label: '❓ Quiz Marks' },
                                                { key: 'survey', label: '📋 Survey Marks' },
                                            ].map(item => (
                                                <div key={item.key}>
                                                    <label className="block text-xs text-gray-500 mb-1">{item.label}</label>
                                                    <input type="number" min={0}
                                                        value={formMarks[item.key as keyof ProgramMarks]}
                                                        onChange={e => setFormMarks({ ...formMarks, [item.key]: Number(e.target.value) })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 outline-none" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-right text-sm font-medium text-blue-600">
                                            Total: {formMarks.content + formMarks.tutorial + formMarks.quiz + formMarks.survey} marks
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === CONTENT TAB === */}
                            {activeTab === 'content' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Add content items (images/PDFs) to the program</p>
                                        <button onClick={addContent}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            <Plus className="w-4 h-4" /> Add Content
                                        </button>
                                    </div>
                                    {formContents.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">No content items added yet</div>
                                    )}
                                    {formContents.map((content, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">Content #{i + 1}</span>
                                                <button onClick={() => removeContent(i)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input type="text" value={content.title} onChange={e => updateContentTitle(i, e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                                                placeholder="Content title" />

                                            {/* File Upload */}
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors">
                                                <label className="flex items-center justify-center gap-2 cursor-pointer">
                                                    <Upload className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm text-gray-500">Upload Images or PDFs</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/jpeg,image/png,image/webp,application/pdf"
                                                        onChange={e => handleContentFileChange(i, e.target.files)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            {/* Existing files (from server) */}
                                            {content.files.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Uploaded Files:</p>
                                                    {content.files.map((f, fi) => (
                                                        <div key={`existing-${fi}`} className="text-xs text-gray-600 flex items-center justify-between bg-white border rounded px-2 py-1.5">
                                                            <div className="flex items-center gap-1">
                                                                {f.type === 'pdf' ? '📎' : '🖼️'} {f.originalName || f.url.split('/').pop()}
                                                            </div>
                                                            <button onClick={() => removeExistingContentFile(i, fi)}
                                                                className="text-red-400 hover:text-red-600 ml-2">
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* New files (not yet uploaded) */}
                                            {contentFiles[i] && contentFiles[i].length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs font-medium text-green-600 mb-1">New Files (will upload on save):</p>
                                                    {contentFiles[i].map((file, fi) => (
                                                        <div key={`new-${fi}`} className="text-xs text-green-700 flex items-center justify-between bg-green-50 border border-green-200 rounded px-2 py-1.5">
                                                            <div className="flex items-center gap-1">
                                                                {file.type === 'application/pdf' ? '📎' : '🖼️'} {file.name}
                                                                <span className="text-green-500 ml-1">({(file.size / 1024).toFixed(0)} KB)</span>
                                                            </div>
                                                            <button onClick={() => removeContentFile(i, fi)}
                                                                className="text-red-400 hover:text-red-600 ml-2">
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* === TUTORIALS TAB === */}
                            {activeTab === 'tutorials' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Add YouTube tutorial videos</p>
                                        <button onClick={addTutorial}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            <Plus className="w-4 h-4" /> Add Tutorial
                                        </button>
                                    </div>
                                    {formTutorials.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">No tutorials added yet</div>
                                    )}
                                    {formTutorials.map((tut, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">Tutorial #{i + 1}</span>
                                                <button onClick={() => removeTutorial(i)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <input type="text" value={tut.title} onChange={e => updateTutorial(i, 'title', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="Tutorial title" />
                                                <input type="text" value={tut.description} onChange={e => updateTutorial(i, 'description', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="Brief description" />
                                                <input type="url" value={tut.youtubeLink} onChange={e => updateTutorial(i, 'youtubeLink', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="https://youtube.com/watch?v=..." />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* === QUIZZES TAB === */}
                            {activeTab === 'quizzes' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Add quizzes with MCQ questions (4 options each)</p>
                                        <button onClick={addQuiz}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            <Plus className="w-4 h-4" /> Add Quiz
                                        </button>
                                    </div>
                                    {formQuizzes.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">No quizzes added yet</div>
                                    )}
                                    {formQuizzes.map((quiz, qi) => (
                                        <div key={qi} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-600">Quiz #{qi + 1}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => addQuizQuestion(qi)}
                                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                                        + Add Question
                                                    </button>
                                                    <button onClick={() => removeQuiz(qi)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="text" value={quiz.title} onChange={e => updateQuizTitle(qi, e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Quiz title" />

                                            {quiz.questions.map((q, qIdx) => (
                                                <div key={qIdx} className="bg-white border rounded-lg p-3 mb-3">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-medium text-gray-400">Question {qIdx + 1}</span>
                                                        <button onClick={() => removeQuizQuestion(qi, qIdx)} className="text-red-400 hover:text-red-600">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <input type="text" value={q.question}
                                                        onChange={e => updateQuizQuestion(qi, qIdx, 'question', e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Question text" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {q.options.map((opt, oi) => (
                                                            <div key={oi} className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`q-${qi}-${qIdx}`}
                                                                    checked={q.correctAnswer === oi}
                                                                    onChange={() => updateQuizQuestion(qi, qIdx, 'correctAnswer', oi)}
                                                                    className="text-green-600"
                                                                />
                                                                <input type="text" value={opt}
                                                                    onChange={e => updateQuizOption(qi, qIdx, oi, e.target.value)}
                                                                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                                    placeholder={`Option ${oi + 1}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">Select the radio button next to the correct answer</p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* === SURVEYS TAB === */}
                            {activeTab === 'surveys' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Add surveys with open-ended questions</p>
                                        <button onClick={addSurvey}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            <Plus className="w-4 h-4" /> Add Survey
                                        </button>
                                    </div>
                                    {formSurveys.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">No surveys added yet</div>
                                    )}
                                    {formSurveys.map((survey, si) => (
                                        <div key={si} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-600">Survey #{si + 1}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => addSurveyQuestion(si)}
                                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                                        + Add Question
                                                    </button>
                                                    <button onClick={() => removeSurvey(si)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="text" value={survey.title} onChange={e => updateSurveyTitle(si, e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Survey title" />
                                            {survey.questions.map((q, qIdx) => (
                                                <div key={qIdx} className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs text-gray-400 w-5">{qIdx + 1}.</span>
                                                    <input type="text" value={q.question}
                                                        onChange={e => updateSurveyQuestion(si, qIdx, e.target.value)}
                                                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Survey question" />
                                                    <button onClick={() => removeSurveyQuestion(si, qIdx)} className="text-red-400 hover:text-red-600">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                            <button onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium">
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : editingProgram ? 'Update Program' : 'Create Program'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
