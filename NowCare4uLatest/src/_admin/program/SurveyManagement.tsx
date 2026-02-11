import { useState, useEffect } from 'react';
import { useAdminAuth } from '../AdminContext';
import { Trash2, ClipboardList, Plus, X, BarChart2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface Survey {
    _id: string;
    title: string;
    questions: { question: string }[];
    responses: any[];
    createdAt: string;
}

export default function SurveyManagement() {
    const { token } = useAdminAuth();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<string[]>(['', '', '', '', '']);

    useEffect(() => {
        fetchSurveys();
    }, [token]);

    const fetchSurveys = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/surveys`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setSurveys(data.data);
        } catch (error) {
            console.error('Failed to fetch surveys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) setSurveys(surveys.filter(s => s._id !== id));
        } catch (error) {
            console.error('Failed to delete survey:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formattedQuestions = questions.map(q => ({ question: q }));
            const response = await fetch(`${API_BASE_URL}/surveys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, questions: formattedQuestions })
            });
            const data = await response.json();
            if (data.success) {
                setSurveys([data.data, ...surveys]);
                setShowAddModal(false);
                setTitle('');
                setQuestions(['', '', '', '', '']);
            }
        } catch (error) {
            console.error('Failed to create survey:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const updateQuestion = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    if (loading) return <div className="p-8 text-center">Loading surveys...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
                    <p className="text-gray-500">Manage patient feedback surveys</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Survey
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {surveys.map((survey) => (
                    <div key={survey._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-gray-900 text-lg">{survey.title}</h3>
                            <button onClick={() => handleDelete(survey._id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2 font-medium">Questions:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {survey.questions.slice(0, 3).map((q, i) => (
                                    <li key={i} className="truncate">{q.question}</li>
                                ))}
                                {survey.questions.length > 3 && <li>...and 2 more</li>}
                            </ul>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <div className="flex items-center text-gray-500 text-sm">
                                <BarChart2 className="w-4 h-4 mr-2" />
                                No responses yet
                            </div>
                            <span className="text-xs text-gray-400">
                                Created: {new Date(survey.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create New Survey</h2>
                            <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Survey Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Post-Checkup Feedback"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900">Questions (Exactly 5)</h3>
                                {questions.map((q, index) => (
                                    <div key={index}>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Question {index + 1}</label>
                                        <input
                                            type="text"
                                            required
                                            value={q}
                                            onChange={(e) => updateQuestion(index, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder={`Enter question ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? 'Creating Survey...' : 'Create Survey'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
