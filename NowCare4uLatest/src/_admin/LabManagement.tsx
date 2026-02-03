import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAuth } from './AdminContext';
import { useLabStore } from './store/lab.store';
import { labService } from './service/lab.service';
import type { Lab } from './types/lab.types';
import LabTable from './lab/LabTable';
import LabDetailsModal from './lab/LabDetailsModal';
import AddLabModal from './lab/AddLabModal';

import LabServicesModal from './lab/LabServicesModal';

export default function LabManagement() {
    const { token } = useAdminAuth();
    const { labs, loading, pagination, fetchLabs, updateLab } = useLabStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
    const [selectedLabForServices, setSelectedLabForServices] = useState<Lab | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Pagination & Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'verified' | 'rejected'>('all');
    const [sortBy] = useState('createdAt');
    const [sortOrder] = useState<'asc' | 'desc'>('desc');

    const loadLabs = useCallback(() => {
        if (!token) return;

        const params: any = {
            page: currentPage,
            limit: pageSize,
            sortBy,
            sortOrder
        };

        if (searchTerm) params.search = searchTerm;
        if (statusFilter !== 'all') params.status = statusFilter;

        fetchLabs(token, params);
    }, [token, currentPage, pageSize, searchTerm, statusFilter, sortBy, sortOrder, fetchLabs]);

    useEffect(() => {
        loadLabs();
    }, [loadLabs]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, pageSize]);

    const handleApprove = async (labId: string) => {
        if (!token) return;

        try {
            setActionLoading(labId);
            await labService.updateApprovalStatus(token, labId, true);
            updateLab(labId, { isApproved: true });
            alert('Lab approved successfully!');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to approve lab');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (labId: string, type: 'approval' | 'verification') => {
        const reason = prompt(`Enter rejection reason for ${type}:`);
        if (!reason || !token) return;

        try {
            setActionLoading(labId);

            if (type === 'approval') {
                await labService.updateApprovalStatus(token, labId, false, reason);
                updateLab(labId, { isApproved: false, rejectionReason: reason });
            } else {
                await labService.updateVerificationStatus(token, labId, false, reason);
                updateLab(labId, { isVerified: false, rejectionReason: reason });
            }

            alert(`Lab ${type} rejected successfully!`);
        } catch (error) {
            alert(error instanceof Error ? error.message : `Failed to reject ${type}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleVerify = async (labId: string) => {
        if (!token) return;

        try {
            setActionLoading(labId);
            await labService.updateVerificationStatus(token, labId, true);
            updateLab(labId, { isVerified: true });
            alert('Lab verified successfully!');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to verify lab');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && labs.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading labs...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lab Management</h1>
                    <p className="text-gray-600">
                        Manage lab registrations and approvals ({pagination?.total || 0} total)
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Lab
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, license number, or GST number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Lab Table */}
            <LabTable
                labs={labs}
                onViewDetails={setSelectedLab}
                onViewServices={setSelectedLabForServices}
                onApprove={handleApprove}
                onReject={handleReject}
                onVerify={handleVerify}
                actionLoading={actionLoading}
            />

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} results
                            </span>
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                            >
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center space-x-1">
                                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                                    let pageNum;
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-lg ${currentPage === pageNum
                                                ? 'bg-purple-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                                disabled={currentPage === pagination.pages}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddModal && <AddLabModal onClose={() => {
                setShowAddModal(false);
                loadLabs(); // Refresh list after adding
            }} />}

            {selectedLab && (
                <LabDetailsModal
                    lab={selectedLab}
                    onClose={() => setSelectedLab(null)}
                />
            )}

            {selectedLabForServices && (
                <LabServicesModal
                    labId={selectedLabForServices._id}
                    labName={selectedLabForServices.name}
                    onClose={() => setSelectedLabForServices(null)}
                />
            )}
        </div>
    );
}
