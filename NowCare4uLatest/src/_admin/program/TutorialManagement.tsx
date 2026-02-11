import { useState, useEffect } from 'react';
import { useAdminAuth } from '../AdminContext';
import { Trash2, Video, Plus, X, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface Tutorial {
    _id: string;
    title: string;
    description: string;
    youtubeLink: string;
    createdAt: string;
}

export default function TutorialManagement() {
    const { token } = useAdminAuth();
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ title: '', description: '', youtubeLink: '' });

    useEffect(() => {
        fetchTutorials();
    }, [token]);

    const fetchTutorials = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tutorials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setTutorials(data.data);
        } catch (error) {
            console.error('Failed to fetch tutorials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/tutorials/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) setTutorials(tutorials.filter(t => t._id !== id));
        } catch (error) {
            console.error('Failed to delete tutorial:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/tutorials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setTutorials([data.data, ...tutorials]);
                setShowAddModal(false);
                setFormData({ title: '', description: '', youtubeLink: '' });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Failed to create tutorial:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading tutorials...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tutorials</h1>
                    <p className="text-gray-500">Manage video tutorials and guides</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tutorial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="relative aspect-video bg-gray-100">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYouTubeID(item.youtubeLink)}`}
                                title={item.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">{item.description}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <a
                                    href={item.youtubeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    View on YouTube
                                </a>
                                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add Tutorial</h2>
                            <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.youtubeLink}
                                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : 'Create Tutorial'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function getYouTubeID(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
