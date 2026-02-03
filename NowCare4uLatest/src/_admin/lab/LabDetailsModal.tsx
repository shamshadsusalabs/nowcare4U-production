import { X, FileText, CheckCircle, XCircle } from 'lucide-react';
import type { Lab } from '../types/lab.types';

interface LabDetailsModalProps {
    lab: Lab;
    onClose: () => void;
}

export default function LabDetailsModal({ lab, onClose }: LabDetailsModalProps) {
    const renderDocumentLink = (label: string, url?: string) => {
        if (!url) return <span className="text-gray-400 italic">Not uploaded</span>;

        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium"
            >
                <FileText className="w-4 h-4 mr-1" />
                View {label}
            </a>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold text-gray-900">{lab.name}</h3>
                            {lab.isVerified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verified
                                </span>
                            )}
                            {lab.rejectionReason && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Rejected
                                </span>
                            )}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Status Message */}
                        {lab.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-red-800 mb-1">Rejection Reason</h4>
                                <p className="text-sm text-red-700">{lab.rejectionReason}</p>
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                                <div className="space-y-2 text-sm text-gray-900">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Email:</span>
                                        <span>{lab.email}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Phone:</span>
                                        <span>{lab.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Address:</span>
                                        <span>{lab.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">City:</span>
                                        <span>{lab.city || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">State:</span>
                                        <span>{lab.state || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Pincode:</span>
                                        <span>{lab.pincode || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Legal Information</h4>
                                <div className="space-y-2 text-sm text-gray-900">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">License Number:</span>
                                        <span>{lab.labLicenseNumber}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">GST Number:</span>
                                        <span>{lab.gstNumber}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Aadhar Number:</span>
                                        <span>{lab.aadharNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">PAN Number:</span>
                                        <span>{lab.panNumber || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-3">Uploaded Documents</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="border rounded-lg p-3 hover:bg-gray-50">
                                    <label className="block text-xs text-gray-500 mb-1">Lab License</label>
                                    {renderDocumentLink('License', lab.labLicenseFile)}
                                </div>
                                <div className="border rounded-lg p-3 hover:bg-gray-50">
                                    <label className="block text-xs text-gray-500 mb-1">GST Certificate</label>
                                    {renderDocumentLink('GST', lab.gstFile)}
                                </div>
                                <div className="border rounded-lg p-3 hover:bg-gray-50">
                                    <label className="block text-xs text-gray-500 mb-1">Aadhar Card</label>
                                    {renderDocumentLink('Aadhar', lab.aadharFile)}
                                </div>
                                <div className="border rounded-lg p-3 hover:bg-gray-50">
                                    <label className="block text-xs text-gray-500 mb-1">PAN Card</label>
                                    {renderDocumentLink('PAN', lab.panFile)}
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 flex justify-between">
                            <span>Registered: {new Date(lab.createdAt).toLocaleString()}</span>
                            <span>Last Updated: {lab.updatedAt ? new Date(lab.updatedAt).toLocaleString() : 'Never'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
