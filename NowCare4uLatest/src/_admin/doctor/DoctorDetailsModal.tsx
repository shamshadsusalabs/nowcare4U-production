import { useState } from 'react';
import {
    X,
    Mail,
    Phone,
    MapPin,
    Award,
    DollarSign,
    Star,
    Calendar,
    FileText,
    Languages,
    ShieldCheck,
} from 'lucide-react';
import type { Doctor } from '../types/doctor.types';
import { formatDateTime } from '../utils/doctor.utils';

interface DoctorDetailsModalProps {
    doctor: Doctor;
    onClose: () => void;
    onApprove?: (doctorId: string) => void;
    onReject?: (doctorId: string, reason: string) => void;
    actionLoading?: boolean;
}

export default function DoctorDetailsModal({
    doctor,
    onClose,
    onApprove,
    onReject,
    actionLoading = false
}: DoctorDetailsModalProps) {
    const [rejectionReason, setRejectionReason] = useState('');

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        onReject?.(doctor._id, rejectionReason);
    };

    const getStatusBadge = () => {
        if (doctor.isVerified) {
            return (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                </span>
            );
        } else if (doctor.rejectionReason) {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
                    <X className="w-3 h-3 mr-1" />
                    Rejected
                </span>
            );
        } else {
            return (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Pending Verification
                </span>
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Doctor Details</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Doctor Header */}
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-xl">
                                    {doctor.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900">{doctor.name}</h4>
                                <p className="text-gray-600">{doctor.speciality}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {getStatusBadge()}
                                    {doctor.profileCompleted && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            Profile Complete
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Doctor ID & Basic Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Doctor ID & Basic Info
                            </h5>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div><strong>ID:</strong> {doctor._id}</div>
                                <div><strong>License Number:</strong> {doctor.licenseNumber}</div>
                                <div><strong>Profile Status:</strong> {doctor.profileCompleted ? 'Complete' : 'Incomplete'}</div>
                            </div>
                        </div>

                        {/* Contact & Professional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h5 className="font-medium text-gray-900 border-b pb-2">Contact Information</h5>
                                <div className="space-y-3">
                                    <div className="flex items-start text-sm">
                                        <Mail className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <span className="text-gray-600">Email:</span>
                                            <div className="font-medium">{doctor.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <Phone className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <span className="text-gray-600">Phone:</span>
                                            <div className="font-medium">{doctor.phone || 'Not provided'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <span className="text-gray-600">Location:</span>
                                            <div className="font-medium">{doctor.location || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="font-medium text-gray-900 border-b pb-2">Professional Details</h5>
                                <div className="space-y-3">
                                    <div className="flex items-start text-sm">
                                        <Award className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <span className="text-gray-600">Experience:</span>
                                            <div className="font-medium">{doctor.experience}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <DollarSign className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <span className="text-gray-600">Consultation Fee:</span>
                                            <div className="font-medium">₹{doctor.consultationFee}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <span className="text-gray-600">Rating:</span>
                                            <div className="font-medium">{doctor.rating}/5 ({doctor.totalReviews} reviews)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Languages & Timestamps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <Languages className="w-4 h-4 mr-2" />
                                    Languages
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.languages?.length > 0 ? (
                                        doctor.languages.map((lang, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                {lang}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">Not specified</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Timestamps
                                </h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div><strong>Created:</strong> {formatDateTime(doctor.createdAt)}</div>
                                    <div><strong>Updated:</strong> {formatDateTime(doctor.updatedAt)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Qualification */}
                        {doctor.qualification && (
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <Award className="w-4 h-4 mr-2" />
                                    Qualification
                                </h5>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-blue-800 font-medium">{doctor.qualification}</p>
                                </div>
                            </div>
                        )}

                        {/* Rejection Reason */}
                        {doctor.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h5 className="font-medium text-red-900 mb-2">Rejection Reason</h5>
                                <p className="text-red-700">{doctor.rejectionReason}</p>
                            </div>
                        )}

                        {/* Action Buttons (for pending doctors) */}
                        {!doctor.isVerified && !doctor.rejectionReason && onApprove && onReject && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason (optional)
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter reason for rejection..."
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => onApprove(doctor._id)}
                                        disabled={actionLoading}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        {actionLoading ? 'Processing...' : 'Verify Doctor'}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={actionLoading || !rejectionReason.trim()}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {actionLoading ? 'Processing...' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
