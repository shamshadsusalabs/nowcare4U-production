import { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import {
    Stethoscope, User, Pill, Mail, Lock, Eye, EyeOff, ArrowLeft,
    BookOpen, FileText, Video, HelpCircle, ClipboardList, Award,
    CheckCircle, ChevronDown, ChevronUp, LogOut
} from 'lucide-react';

// ==================== TYPES ====================

interface ContentFile {
    url: string;
    type: 'image' | 'pdf';
    originalName?: string;
}

interface ContentItem {
    _id: string;
    title: string;
    files: ContentFile[];
}

interface TutorialItem {
    _id: string;
    title: string;
    description: string;
    youtubeLink: string;
}

interface QuizQuestion {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizItem {
    _id: string;
    title: string;
    questions: QuizQuestion[];
}

interface SurveyQuestion {
    _id: string;
    question: string;
}

interface SurveyItem {
    _id: string;
    title: string;
    questions: SurveyQuestion[];
}

interface Program {
    _id: string;
    title: string;
    description: string;
    accessRoles: string[];
    marks: { content: number; tutorial: number; quiz: number; survey: number };
    totalMarks: number;
    contents: ContentItem[];
    tutorials: TutorialItem[];
    quizzes: QuizItem[];
    surveys: SurveyItem[];
}

interface Participation {
    _id: string;
    completedContents: string[];
    completedTutorials: string[];
    quizAttempts: { quizId: string; score: number; totalQuestions: number; percentage: number }[];
    surveyResponses: { surveyId: string }[];
    marksEarned: { content: number; tutorial: number; quiz: number; survey: number };
    totalMarksEarned: number;
    status: string;
}

type RoleType = 'doctor' | 'user' | 'pharmacist';

// ==================== ROLE COLORS ====================

const roleConfig: Record<RoleType, { gradient: string; bg: string; icon: any; label: string; desc: string }> = {
    doctor: {
        gradient: 'from-blue-600 to-indigo-700',
        bg: 'bg-blue-50',
        icon: Stethoscope,
        label: 'Doctor',
        desc: 'Login with your registered email & password'
    },
    user: {
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50',
        icon: User,
        label: 'Patient',
        desc: 'Enter your name & email to continue'
    },
    pharmacist: {
        gradient: 'from-purple-600 to-pink-600',
        bg: 'bg-purple-50',
        icon: Pill,
        label: 'Pharmacist',
        desc: 'Login with your registered email & password'
    }
};

// ==================== MAIN COMPONENT ====================

export default function ProgramPage() {
    const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [participantInfo, setParticipantInfo] = useState<{ id: string; name: string; token?: string } | null>(null);

    // Login form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Programs
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loadingPrograms, setLoadingPrograms] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [participation, setParticipation] = useState<Participation | null>(null);

    // Program detail view
    const [activeSection, setActiveSection] = useState<'overview' | 'content' | 'tutorials' | 'quizzes' | 'surveys'>('overview');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    // Quiz state
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizSubmitting, setQuizSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

    // Survey state
    const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
    const [surveySubmitting, setSurveySubmitting] = useState(false);

    // ==================== CHECK STORED SESSION ====================

    useEffect(() => {
        const storedRole = localStorage.getItem('program_role') as RoleType | null;
        const storedInfo = localStorage.getItem('program_participant');
        if (storedRole && storedInfo) {
            try {
                const info = JSON.parse(storedInfo);
                setSelectedRole(storedRole);
                setParticipantInfo(info);
                setIsLoggedIn(true);
            } catch { /* ignore */ }
        }
    }, []);

    // ==================== FETCH PROGRAMS ON LOGIN ====================

    useEffect(() => {
        if (isLoggedIn && selectedRole) {
            fetchPrograms();
        }
    }, [isLoggedIn, selectedRole]);

    const fetchPrograms = async () => {
        if (!selectedRole) return;
        setLoadingPrograms(true);
        try {
            const res = await fetch(buildApiUrl(`programs/role/${selectedRole}`));
            const data = await res.json();
            if (data.success) setPrograms(data.data);
        } catch (err) {
            console.error('Failed to fetch programs:', err);
        } finally {
            setLoadingPrograms(false);
        }
    };

    // ==================== LOGIN HANDLERS ====================

    const handleDoctorLogin = async () => {
        if (!email || !password) { setLoginError('Please fill in all fields'); return; }
        setLoginLoading(true);
        setLoginError('');
        try {
            const res = await fetch(buildApiUrl('doctors/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                const info = { id: data.doctor._id || data.doctor.id, name: data.doctor.name, token: data.token };
                setParticipantInfo(info);
                localStorage.setItem('program_role', 'doctor');
                localStorage.setItem('program_participant', JSON.stringify(info));
                setIsLoggedIn(true);
            } else {
                setLoginError(data.message || 'Login failed');
            }
        } catch { setLoginError('Network error. Please try again.'); }
        finally { setLoginLoading(false); }
    };

    const handlePharmacistLogin = async () => {
        if (!email || !password) { setLoginError('Please fill in all fields'); return; }
        setLoginLoading(true);
        setLoginError('');
        try {
            const res = await fetch(buildApiUrl('pharmacists/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                const info = { id: data.pharmacist._id || data.pharmacist.id, name: data.pharmacist.name, token: data.token };
                setParticipantInfo(info);
                localStorage.setItem('program_role', 'pharmacist');
                localStorage.setItem('program_participant', JSON.stringify(info));
                setIsLoggedIn(true);
            } else {
                setLoginError(data.message || 'Login failed');
            }
        } catch { setLoginError('Network error. Please try again.'); }
        finally { setLoginLoading(false); }
    };

    const handlePatientLogin = async () => {
        if (!name || !email) { setLoginError('Please fill in all fields'); return; }
        setLoginLoading(true);
        setLoginError('');
        try {
            // For patients, try login first, if fails try register
            const loginRes = await fetch(buildApiUrl('auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: 'patient123' })
            });
            const loginData = await loginRes.json();
            if (loginData.success) {
                const info = { id: loginData.user?._id || loginData.user?.id || email, name, token: loginData.token };
                setParticipantInfo(info);
                localStorage.setItem('program_role', 'user');
                localStorage.setItem('program_participant', JSON.stringify(info));
                setIsLoggedIn(true);
            } else {
                // Try register
                const regRes = await fetch(buildApiUrl('auth/register'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password: 'patient123' })
                });
                const regData = await regRes.json();
                if (regData.success) {
                    const info = { id: regData.user?._id || regData.user?.id || email, name, token: regData.token };
                    setParticipantInfo(info);
                    localStorage.setItem('program_role', 'user');
                    localStorage.setItem('program_participant', JSON.stringify(info));
                    setIsLoggedIn(true);
                } else {
                    // Still allow with just name + email for tracking
                    const info = { id: email, name };
                    setParticipantInfo(info);
                    localStorage.setItem('program_role', 'user');
                    localStorage.setItem('program_participant', JSON.stringify(info));
                    setIsLoggedIn(true);
                }
            }
        } catch {
            // Fallback: allow with name+email
            const info = { id: email, name };
            setParticipantInfo(info);
            localStorage.setItem('program_role', 'user');
            localStorage.setItem('program_participant', JSON.stringify(info));
            setIsLoggedIn(true);
        }
        finally { setLoginLoading(false); }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole === 'doctor') handleDoctorLogin();
        else if (selectedRole === 'pharmacist') handlePharmacistLogin();
        else handlePatientLogin();
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setSelectedRole(null);
        setParticipantInfo(null);
        setPrograms([]);
        setSelectedProgram(null);
        setParticipation(null);
        setEmail('');
        setPassword('');
        setName('');
        setLoginError('');
        localStorage.removeItem('program_role');
        localStorage.removeItem('program_participant');
    };

    // ==================== PROGRAM PARTICIPATION ====================

    const openProgram = async (program: Program) => {
        setSelectedProgram(program);
        setActiveSection('overview');
        setQuizResult(null);
        setQuizAnswers({});
        setSurveyAnswers({});

        if (!participantInfo) return;

        try {
            const res = await fetch(buildApiUrl(`programs/${program._id}/participate`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantType: selectedRole,
                    participantId: participantInfo.id,
                    participantName: participantInfo.name
                })
            });
            const data = await res.json();
            if (data.success) setParticipation(data.data);
        } catch (err) {
            console.error('Failed to join program:', err);
        }
    };

    const markContentComplete = async (contentId: string) => {
        if (!selectedProgram || !participantInfo) return;
        try {
            const res = await fetch(buildApiUrl(`programs/${selectedProgram._id}/content/${contentId}/complete`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId: participantInfo.id })
            });
            const data = await res.json();
            if (data.success) setParticipation(data.data);
        } catch (err) { console.error(err); }
    };

    const markTutorialComplete = async (tutorialId: string) => {
        if (!selectedProgram || !participantInfo) return;
        try {
            const res = await fetch(buildApiUrl(`programs/${selectedProgram._id}/tutorial/${tutorialId}/complete`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId: participantInfo.id })
            });
            const data = await res.json();
            if (data.success) setParticipation(data.data);
        } catch (err) { console.error(err); }
    };

    const submitQuiz = async (quizId: string) => {
        if (!selectedProgram || !participantInfo) return;
        setQuizSubmitting(true);
        try {
            const res = await fetch(buildApiUrl(`programs/${selectedProgram._id}/quiz/${quizId}/submit`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: participantInfo.id,
                    answers: quizAnswers
                })
            });
            const data = await res.json();
            if (data.success) {
                setQuizResult({
                    score: data.data.score,
                    total: data.data.totalQuestions,
                    percentage: data.data.percentage
                });
                setParticipation(data.data.participation);
            }
        } catch (err) { console.error(err); }
        finally { setQuizSubmitting(false); }
    };

    const submitSurvey = async (surveyId: string) => {
        if (!selectedProgram || !participantInfo) return;
        setSurveySubmitting(true);
        try {
            const res = await fetch(buildApiUrl(`programs/${selectedProgram._id}/survey/${surveyId}/submit`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: participantInfo.id,
                    responses: surveyAnswers
                })
            });
            const data = await res.json();
            if (data.success) {
                setParticipation(data.data);
                setSurveyAnswers({});
                alert('Survey submitted successfully!');
            }
        } catch (err) { console.error(err); }
        finally { setSurveySubmitting(false); }
    };

    // ==================== YOUTUBE EMBED HELPER ====================

    const getYoutubeEmbedUrl = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : '';
    };

    // ==================== RENDER: ROLE SELECTION ====================

    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-sm mb-6">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Learning Programs</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Your Programs</h1>
                        <p className="text-lg text-gray-500 max-w-xl mx-auto">
                            Select your role to log in and access educational content, tutorials, quizzes, and surveys assigned to you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {(Object.keys(roleConfig) as RoleType[]).map(role => {
                            const config = roleConfig[role];
                            const Icon = config.icon;
                            return (
                                <button
                                    key={role}
                                    onClick={() => { setSelectedRole(role); setLoginError(''); setEmail(''); setPassword(''); setName(''); }}
                                    className="group bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{config.label}</h3>
                                    <p className="text-sm text-gray-500">{config.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ==================== RENDER: LOGIN FORM ====================

    if (!isLoggedIn) {
        const config = roleConfig[selectedRole];
        const Icon = config.icon;
        const isPatient = selectedRole === 'user';

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-16 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${config.gradient} p-8 text-center relative`}>
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="absolute left-4 top-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{config.label} Login</h2>
                            <p className="text-white/80 text-sm">{config.desc}</p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <form onSubmit={handleLogin} className="space-y-5">
                                {isPatient && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder={`${selectedRole}@example.com`}
                                        />
                                    </div>
                                </div>

                                {!isPatient && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="Enter your password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {loginError && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                        <p className="text-red-600 text-sm">{loginError}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loginLoading}
                                    className={`w-full bg-gradient-to-r ${config.gradient} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-[1.02]`}
                                >
                                    {loginLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing In...
                                        </span>
                                    ) : isPatient ? 'Continue' : 'Sign In'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== RENDER: PROGRAM DETAIL VIEW ====================

    if (selectedProgram) {
        const config = roleConfig[selectedRole];
        const isContentCompleted = (id: string) => participation?.completedContents.includes(id) || false;
        const isTutorialCompleted = (id: string) => participation?.completedTutorials.includes(id) || false;
        const isQuizAttempted = (id: string) => participation?.quizAttempts.some(a => a.quizId === id) || false;
        const isSurveyDone = (id: string) => participation?.surveyResponses.some(r => r.surveyId === id) || false;

        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => { setSelectedProgram(null); setQuizResult(null); setQuizAnswers({}); setSurveyAnswers({}); }}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                                <ArrowLeft className="w-5 h-5" /> Back to Programs
                            </button>
                            {participation && (
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    <span className="font-bold text-blue-700">{participation.totalMarksEarned}</span>
                                    <span className="text-gray-400">/ {selectedProgram.totalMarks} marks</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h2>
                        {selectedProgram.description && <p className="text-gray-500 mt-1">{selectedProgram.description}</p>}

                        {/* Section tabs */}
                        <div className="flex gap-2 mt-5 flex-wrap">
                            {[
                                { key: 'overview', label: 'Overview', icon: '📊' },
                                { key: 'content', label: `Content (${selectedProgram.contents.length})`, icon: '📄' },
                                { key: 'tutorials', label: `Tutorials (${selectedProgram.tutorials.length})`, icon: '🎥' },
                                { key: 'quizzes', label: `Quizzes (${selectedProgram.quizzes.length})`, icon: '❓' },
                                { key: 'surveys', label: `Surveys (${selectedProgram.surveys.length})`, icon: '📋' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => { setActiveSection(tab.key as any); setQuizResult(null); }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeSection === tab.key
                                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    {activeSection === 'overview' && participation && (
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Content', earned: participation.marksEarned.content, total: selectedProgram.marks.content, done: participation.completedContents.length, count: selectedProgram.contents.length, icon: FileText, color: 'blue' },
                                { label: 'Tutorials', earned: participation.marksEarned.tutorial, total: selectedProgram.marks.tutorial, done: participation.completedTutorials.length, count: selectedProgram.tutorials.length, icon: Video, color: 'green' },
                                { label: 'Quizzes', earned: participation.marksEarned.quiz, total: selectedProgram.marks.quiz, done: participation.quizAttempts.length, count: selectedProgram.quizzes.length, icon: HelpCircle, color: 'orange' },
                                { label: 'Surveys', earned: participation.marksEarned.survey, total: selectedProgram.marks.survey, done: participation.surveyResponses.length, count: selectedProgram.surveys.length, icon: ClipboardList, color: 'purple' },
                            ].map(item => (
                                <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                                    <item.icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <div className="text-sm font-medium text-gray-600 mb-1">{item.label}</div>
                                    <div className="text-2xl font-bold text-gray-900">{item.done}/{item.count}</div>
                                    <div className="text-xs text-gray-400 mt-1">{item.earned}/{item.total} marks</div>
                                    {/* Progress bar */}
                                    <div className="mt-3 bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
                                            style={{ width: `${item.count > 0 ? (item.done / item.count) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CONTENT SECTION */}
                    {activeSection === 'content' && (
                        <div className="space-y-4">
                            {selectedProgram.contents.length === 0 ? (
                                <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No content items</div>
                            ) : selectedProgram.contents.map(content => (
                                <div key={content._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium text-gray-900">{content.title}</span>
                                            {isContentCompleted(content._id) && (
                                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Completed
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {content.files.length > 0 && (
                                                <button onClick={() => setExpandedItem(expandedItem === content._id ? null : content._id)}
                                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                    {content.files.length} file(s)
                                                    {expandedItem === content._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            )}
                                            {!isContentCompleted(content._id) && (
                                                <button onClick={() => markContentComplete(content._id)}
                                                    className={`px-3 py-1.5 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${config.gradient} hover:opacity-90`}>
                                                    Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {expandedItem === content._id && content.files.length > 0 && (
                                        <div className="border-t bg-gray-50 p-4 space-y-2">
                                            {content.files.map((f, fi) => (
                                                <a key={fi} href={f.url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-2 bg-white rounded-lg border">
                                                    {f.type === 'pdf' ? '📎' : '🖼️'} {f.originalName || `File ${fi + 1}`}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TUTORIALS SECTION */}
                    {activeSection === 'tutorials' && (
                        <div className="space-y-4">
                            {selectedProgram.tutorials.length === 0 ? (
                                <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No tutorials</div>
                            ) : selectedProgram.tutorials.map(tut => (
                                <div key={tut._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Video className="w-5 h-5 text-green-500" />
                                                <span className="font-medium text-gray-900">{tut.title}</span>
                                                {isTutorialCompleted(tut._id) && (
                                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                        <CheckCircle className="w-3 h-3" /> Completed
                                                    </span>
                                                )}
                                            </div>
                                            {!isTutorialCompleted(tut._id) && (
                                                <button onClick={() => markTutorialComplete(tut._id)}
                                                    className={`px-3 py-1.5 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${config.gradient} hover:opacity-90`}>
                                                    Mark Complete
                                                </button>
                                            )}
                                        </div>
                                        {tut.description && <p className="text-sm text-gray-500 mb-3">{tut.description}</p>}
                                        {tut.youtubeLink && (
                                            <div className="aspect-video rounded-xl overflow-hidden bg-black">
                                                <iframe
                                                    src={getYoutubeEmbedUrl(tut.youtubeLink)}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                    title={tut.title}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* QUIZZES SECTION */}
                    {activeSection === 'quizzes' && (
                        <div className="space-y-4">
                            {selectedProgram.quizzes.length === 0 ? (
                                <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No quizzes</div>
                            ) : selectedProgram.quizzes.map(quiz => (
                                <div key={quiz._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <HelpCircle className="w-5 h-5 text-orange-500" />
                                                <span className="font-medium text-gray-900">{quiz.title}</span>
                                                <span className="text-xs text-gray-400">{quiz.questions.length} questions</span>
                                                {isQuizAttempted(quiz._id) && (
                                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                        <CheckCircle className="w-3 h-3" /> Attempted
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => setExpandedItem(expandedItem === quiz._id ? null : quiz._id)}
                                                className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                {expandedItem === quiz._id ? 'Hide' : 'Start Quiz'}
                                                {expandedItem === quiz._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {expandedItem === quiz._id && (
                                            <div className="space-y-4 mt-2">
                                                {quiz.questions.map((q, qi) => (
                                                    <div key={q._id} className="bg-gray-50 rounded-xl p-4">
                                                        <p className="font-medium text-gray-800 mb-3">Q{qi + 1}. {q.question}</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {q.options.map((opt, oi) => (
                                                                <label key={oi}
                                                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${quizAnswers[q._id] === oi
                                                                        ? 'border-blue-500 bg-blue-50'
                                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                                        }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`quiz-${quiz._id}-${q._id}`}
                                                                        checked={quizAnswers[q._id] === oi}
                                                                        onChange={() => setQuizAnswers({ ...quizAnswers, [q._id]: oi })}
                                                                        className="accent-blue-600"
                                                                    />
                                                                    <span className="text-sm">{opt}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                {quizResult && (
                                                    <div className={`rounded-xl p-5 text-center ${quizResult.percentage >= 70 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                                        <div className="text-3xl font-bold mb-1">{quizResult.percentage.toFixed(0)}%</div>
                                                        <p className="text-gray-600">Score: {quizResult.score}/{quizResult.total}</p>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => submitQuiz(quiz._id)}
                                                    disabled={quizSubmitting || Object.keys(quizAnswers).length < quiz.questions.length}
                                                    className={`w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r ${config.gradient} disabled:opacity-50 hover:opacity-90 transition-all`}
                                                >
                                                    {quizSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SURVEYS SECTION */}
                    {activeSection === 'surveys' && (
                        <div className="space-y-4">
                            {selectedProgram.surveys.length === 0 ? (
                                <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No surveys</div>
                            ) : selectedProgram.surveys.map(survey => (
                                <div key={survey._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <ClipboardList className="w-5 h-5 text-purple-500" />
                                                <span className="font-medium text-gray-900">{survey.title}</span>
                                                <span className="text-xs text-gray-400">{survey.questions.length} questions</span>
                                                {isSurveyDone(survey._id) && (
                                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                        <CheckCircle className="w-3 h-3" /> Submitted
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => setExpandedItem(expandedItem === survey._id ? null : survey._id)}
                                                className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                {expandedItem === survey._id ? 'Hide' : 'Fill Survey'}
                                                {expandedItem === survey._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {expandedItem === survey._id && (
                                            <div className="space-y-4 mt-2">
                                                {survey.questions.map((q, qi) => (
                                                    <div key={q._id} className="bg-gray-50 rounded-xl p-4">
                                                        <p className="font-medium text-gray-800 mb-2">Q{qi + 1}. {q.question}</p>
                                                        <textarea
                                                            value={surveyAnswers[q._id] || ''}
                                                            onChange={e => setSurveyAnswers({ ...surveyAnswers, [q._id]: e.target.value })}
                                                            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none h-20"
                                                            placeholder="Type your response..."
                                                        />
                                                    </div>
                                                ))}

                                                <button
                                                    onClick={() => submitSurvey(survey._id)}
                                                    disabled={surveySubmitting || Object.keys(surveyAnswers).length < survey.questions.length}
                                                    className={`w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r ${config.gradient} disabled:opacity-50 hover:opacity-90 transition-all`}
                                                >
                                                    {surveySubmitting ? 'Submitting...' : 'Submit Survey'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ==================== RENDER: PROGRAM LIST ====================

    const config = roleConfig[selectedRole];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.gradient} flex items-center justify-center shadow-md`}>
                                <config.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Welcome, {participantInfo?.name}</h2>
                                <p className="text-sm text-gray-500">
                                    Logged in as <span className="font-medium capitalize">{config.label}</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                {/* Programs */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" /> Your Programs
                </h3>

                {loadingPrograms ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                        <p className="text-gray-500">Loading programs...</p>
                    </div>
                ) : programs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No programs available for your role</p>
                        <p className="text-gray-400 text-sm mt-1">Check back later for new programs</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {programs.map(program => (
                            <div key={program._id}
                                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                                onClick={() => openProgram(program)}
                            >
                                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {program.title}
                                </h4>
                                {program.description && (
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{program.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {program.contents.length} Content</span>
                                    <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {program.tutorials.length} Tutorials</span>
                                    <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> {program.quizzes.length} Quizzes</span>
                                    <span className="flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> {program.surveys.length} Surveys</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
                                        <Award className="w-4 h-4" /> {program.totalMarks} Total Marks
                                    </span>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white`}>
                                        Open →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
