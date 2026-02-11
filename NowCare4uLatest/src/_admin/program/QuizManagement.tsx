import { useState, useEffect } from 'react';
import { useAdminAuth } from '../AdminContext';
import { Trash2, HelpCircle, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface Quiz {
    _id: string;
    title: string;
    questions: Question[];
    createdAt: string;
}

export default function QuizManagement() {
    const { token } = useAdminAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);

    useEffect(() => {
        fetchQuizzes();
    }, [token]);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setQuizzes(data.data);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) setQuizzes(quizzes.filter(q => q._id !== id));
        } catch (error) {
            console.error('Failed to delete quiz:', error);
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const handleRemoveQuestion = (index: number) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, questions })
            });
            const data = await response.json();
            if (data.success) {
                setQuizzes([data.data, ...quizzes]);
                setShowAddModal(false);
                setTitle('');
                setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
            }
        } catch (error) {
            console.error('Failed to create quiz:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading quizzes...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
                    <p className="text-gray-500">Create and manage interactive quizzes</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {quizzes.map((quiz) => (
                            <tr key={quiz._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{quiz.title}</td>
                                <td className="px-6 py-4 text-gray-500">{quiz.questions.length} Questions</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(quiz.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(quiz._id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create New Quiz</h2>
                            <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Pregnancy Nutrition Basics"
                                />
                            </div>

                            <div className="space-y-6">
                                {questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-medium text-gray-900">Question {qIndex + 1}</h3>
                                            {questions.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                required
                                                value={q.question}
                                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Enter question text"
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={q.correctAnswer === oIndex}
                                                            onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                            className="mr-2"
                                                        />
                                                        <input
                                                            type="text"
                                                            required
                                                            value={opt}
                                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                            className={`w-full px-3 py-2 border rounded-lg ${q.correctAnswer === oIndex ? 'border-green-500 ring-1 ring-green-500' : ''}`}
                                                            placeholder={`Option ${oIndex + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Another Question
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {submitting ? 'Creating Quiz...' : 'Create Quiz'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
