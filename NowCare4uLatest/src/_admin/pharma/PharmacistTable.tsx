import { User, Mail, Phone, FileText, Receipt, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import type { Pharmacist } from '../types/pharmacist.types';
import { formatDate } from '../utils/pharmacist.utils';

interface PharmacistTableProps {
    pharmacists: Pharmacist[];
    onViewDetails: (pharmacist: Pharmacist) => void;
    onApprove: (id: string) => void;
    onReject: (id: string, type: 'approval' | 'verification') => void;
    onVerify: (id: string) => void;
    actionLoading: string | null;
}

export default function PharmacistTable({
    pharmacists,
    onViewDetails,
    onApprove,
    onReject,
    onVerify,
    actionLoading
}: PharmacistTableProps) {
    const getStatusBadge = (pharmacist: Pharmacist) => {
        if (pharmacist.rejectionReason) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Rejected
                </span>
            );
        }

        if (pharmacist.isVerified && pharmacist.isApproved) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified & Approved
                </span>
            );
        }

        if (pharmacist.isApproved) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Pending
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pharmacist Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                License & GST
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Registration Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pharmacists.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No pharmacists found.
                                </td>
                            </tr>
                        ) : (
                            pharmacists.map((pharmacist) => (
                                <tr key={pharmacist._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{pharmacist.name}</div>
                                                <div className="text-sm text-gray-500">ID: {pharmacist._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                {pharmacist.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                {pharmacist.phoneNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                                {pharmacist.licenseNumber}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Receipt className="w-4 h-4 text-gray-400 mr-2" />
                                                {pharmacist.gstNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            {getStatusBadge(pharmacist)}
                                            {pharmacist.rejectionReason && (
                                                <div className="flex items-start text-xs text-red-600">
                                                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                                    <span>{pharmacist.rejectionReason}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {formatDate(pharmacist.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => onViewDetails(pharmacist)}
                                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Eye className="w-3 h-3 mr-1" />
                                                View Details
                                            </button>

                                            {!pharmacist.isApproved && !pharmacist.rejectionReason && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onApprove(pharmacist._id)}
                                                        disabled={actionLoading === pharmacist._id}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(pharmacist._id, 'approval')}
                                                        disabled={actionLoading === pharmacist._id}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {pharmacist.isApproved && !pharmacist.isVerified && !pharmacist.rejectionReason && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onVerify(pharmacist._id)}
                                                        disabled={actionLoading === pharmacist._id}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(pharmacist._id, 'verification')}
                                                        disabled={actionLoading === pharmacist._id}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {(pharmacist.isVerified || pharmacist.rejectionReason) && (
                                                <span className="text-xs text-gray-500">
                                                    {pharmacist.isVerified ? 'Fully processed' : 'Action completed'}
                                                </span>
                                            )}

                                            {actionLoading === pharmacist._id && (
                                                <span className="text-xs text-blue-600">Processing...</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
