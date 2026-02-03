import { X, User, Phone, Mail, FileText, Receipt, Calendar, CreditCard, Download, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Pharmacist } from '../types/pharmacist.types';
import { formatDate } from '../utils/pharmacist.utils';

interface PharmacistDetailsModalProps {
    pharmacist: Pharmacist;
    onClose: () => void;
}

export default function PharmacistDetailsModal({ pharmacist, onClose }: PharmacistDetailsModalProps) {
    const getStatusBadge = () => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Pharmacist Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Complete information and documents</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Current Status</h3>
                            <div className="mt-2">{getStatusBadge()}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Registration Date</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(pharmacist.createdAt)}</p>
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    {pharmacist.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800">Rejection Reason</h4>
                                    <p className="text-sm text-red-600 mt-1">{pharmacist.rejectionReason}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                                <p className="text-sm text-gray-900 mt-1">{pharmacist.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Pharmacist ID</label>
                                <p className="text-sm text-gray-900 mt-1 font-mono">{pharmacist._id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-green-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    Email Address
                                </label>
                                <p className="text-sm text-gray-900 mt-1">{pharmacist.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    Phone Number
                                </label>
                                <p className="text-sm text-gray-900 mt-1">{pharmacist.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* License & Business Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-600" />
                            License & Business Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">License Number</label>
                                <p className="text-sm text-gray-900 mt-1 font-mono">{pharmacist.licenseNumber}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">GST Number</label>
                                <p className="text-sm text-gray-900 mt-1 font-mono">{pharmacist.gstNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* KYC Information */}
                    {(pharmacist.aadharNumber || pharmacist.panNumber) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                                KYC Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pharmacist.aadharNumber && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Aadhar Number</label>
                                        <p className="text-sm text-gray-900 mt-1 font-mono">{pharmacist.aadharNumber}</p>
                                    </div>
                                )}
                                {pharmacist.panNumber && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">PAN Number</label>
                                        <p className="text-sm text-gray-900 mt-1 font-mono">{pharmacist.panNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Receipt className="w-5 h-5 mr-2 text-orange-600" />
                            Uploaded Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pharmacist.aadharFile && (
                                <a
                                    href={pharmacist.aadharFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                                        <span className="text-sm font-medium text-blue-900">Aadhar Card</span>
                                    </div>
                                    <Download className="w-4 h-4 text-blue-600" />
                                </a>
                            )}
                            {pharmacist.panFile && (
                                <a
                                    href={pharmacist.panFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-green-600 mr-2" />
                                        <span className="text-sm font-medium text-green-900">PAN Card</span>
                                    </div>
                                    <Download className="w-4 h-4 text-green-600" />
                                </a>
                            )}
                            {pharmacist.licenseFile && (
                                <a
                                    href={pharmacist.licenseFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-purple-600 mr-2" />
                                        <span className="text-sm font-medium text-purple-900">License Document</span>
                                    </div>
                                    <Download className="w-4 h-4 text-purple-600" />
                                </a>
                            )}
                            {pharmacist.gstFile && (
                                <a
                                    href={pharmacist.gstFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-orange-600 mr-2" />
                                        <span className="text-sm font-medium text-orange-900">GST Certificate</span>
                                    </div>
                                    <Download className="w-4 h-4 text-orange-600" />
                                </a>
                            )}
                        </div>
                        {!pharmacist.aadharFile && !pharmacist.panFile && !pharmacist.licenseFile && !pharmacist.gstFile && (
                            <p className="text-sm text-gray-500 text-center py-4">No documents uploaded</p>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                            Timeline
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Registration Date</span>
                                <span className="text-sm font-medium text-gray-900">{formatDate(pharmacist.createdAt)}</span>
                            </div>
                            {pharmacist.updatedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Last Updated</span>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(pharmacist.updatedAt)}</span>
                                </div>
                            )}
                            {pharmacist.approvedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Approved Date</span>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(pharmacist.approvedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
