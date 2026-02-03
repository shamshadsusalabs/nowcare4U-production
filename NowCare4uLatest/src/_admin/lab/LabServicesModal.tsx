import { useState, useEffect } from 'react';
import { X, Search, Filter, FlaskConical, Clock, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import type { LabTest } from '../types/lab.types';
import { labService } from '../service/lab.service';
import { useAdminAuth } from '../AdminContext';

interface LabServicesModalProps {
    labId: string;
    labName: string;
    onClose: () => void;
}

export default function LabServicesModal({ labId, labName, onClose }: LabServicesModalProps) {
    const { token } = useAdminAuth();
    const [services, setServices] = useState<LabTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchServices();
    }, [labId]);

    const fetchServices = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await labService.getLabServices(token, labId);
            setServices(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredServices = services.filter(service => {
        const matchesSearch = service.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
        // Check if isActive matches statusFilter (e.g. 'Active' -> true, 'Inactive' -> false)
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Active' ? service.isActive : !service.isActive);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Unique categories for dropdown
    const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
                <div className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Services for {labName}</h3>
                            <p className="text-sm text-gray-500">Manage and view offered tests</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                            <p className="text-gray-500">Loading services...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
                            <XCircle size={18} />
                            {error}
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <FlaskConical className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-gray-500 text-lg">No services found for this lab.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="md:col-span-2 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by test name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                                    />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Details</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pricing</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TAT</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {filteredServices.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                    No services match your filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredServices.map(service => (
                                                <tr key={service._id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                                <FlaskConical size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{service.testName}</h4>
                                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-xs" title={service.description}>
                                                                    {service.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                            {service.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            {service.discountedPrice ? (
                                                                <>
                                                                    <span className="text-xs text-gray-400 line-through">₹{service.price}</span>
                                                                    <span className="font-bold text-green-600 flex items-center gap-0.5">
                                                                        <IndianRupee size={12} />{service.discountedPrice}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="font-medium text-gray-900 flex items-center gap-0.5">
                                                                    <IndianRupee size={12} />{service.price}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={14} className="text-gray-400" />
                                                            {service.reportTurnaroundTime || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {service.isActive ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                                <CheckCircle size={12} className="mr-1" /> Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                                <XCircle size={12} className="mr-1" /> Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
