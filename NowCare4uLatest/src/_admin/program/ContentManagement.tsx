import { useState, useEffect } from 'react';
import { useAdminAuth } from '../AdminContext';
import { Trash2, FileText, Upload, Plus, X, Image as ImageIcon, File } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface ContentFile {
    url: string;
    type: 'image' | 'pdf';
    originalName: string;
}

interface Content {
    _id: string;
    title: string;
    files: ContentFile[];
    createdAt: string;
}

export default function ContentManagement() {
    const { token } = useAdminAuth();
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    useEffect(() => {
        fetchContent();
    }, [token]);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/content`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setContents(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this content?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/content/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setContents(contents.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete content:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0) return alert('Please select at least one file');

        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch(`${API_BASE_URL}/content`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setContents([data.data, ...contents]);
                setShowAddModal(false);
                setTitle('');
                setFiles(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Failed to create content:', error);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading content...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Multimedia Content</h1>
                    <p className="text-gray-500">Manage educational images and PDF documents</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 truncate pr-2">{item.title}</h3>
                            <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="text-sm text-gray-500 mb-2">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                            <div className="space-y-2">
                                {item.files.map((file, idx) => (
                                    <a
                                        key={idx}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {file.type === 'image' ? (
                                            <ImageIcon className="w-4 h-4 text-blue-500 mr-2" />
                                        ) : (
                                            <File className="w-4 h-4 text-red-500 mr-2" />
                                        )}
                                        <span className="text-sm text-gray-700 truncate">{file.originalName || `File ${idx + 1}`}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Content</h2>
                            <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Prenatal Yoga Guide"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Files (Images/PDF)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setFiles(e.target.files)}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <span className="text-sm text-blue-600 font-medium">Click to upload</span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {files ? `${files.length} files selected` : 'JPG, PNG, PDF up to 10MB'}
                                        </p>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Create Content'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
