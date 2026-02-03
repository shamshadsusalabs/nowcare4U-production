import { Eye, Mail, Award, Calendar, Shield, ShieldCheck, X } from 'lucide-react';
import type { Doctor } from '../types/doctor.types';

interface DoctorTableProps {
    doctors: Doctor[];
    onViewDetails: (doctor: Doctor) => void;
    onToggleVerification: (doctorId: string, currentStatus: boolean) => void;
    verifyingDoctorId: string | null;
}

export default function DoctorTable({
    doctors,
    onViewDetails,
    onToggleVerification,
    verifyingDoctorId
}: DoctorTableProps) {
    const getStatusBadge = (doctor: Doctor) => {
        if (doctor.isVerified) {
            return (
                <button
                    onClick={() => onToggleVerification(doctor._id, doctor.isVerified)}
                    disabled={verifyingDoctorId === doctor._id}
                    className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-xs font-medium flex items-center transition-colors cursor-pointer disabled:opacity-50"
                >
                    {verifyingDoctorId === doctor._id ? (
                        <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin mr-1" />
                    ) : (
                        <ShieldCheck className="w-3 h-3 mr-1" />
                    )}
                    {verifyingDoctorId === doctor._id ? 'Updating...' : 'Verified'}
                </button>
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
                <button
                    onClick={() => onToggleVerification(doctor._id, doctor.isVerified)}
                    disabled={verifyingDoctorId === doctor._id}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-full text-xs font-medium flex items-center transition-colors cursor-pointer disabled:opacity-50"
                >
                    {verifyingDoctorId === doctor._id ? (
                        <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin mr-1" />
                    ) : (
                        <Shield className="w-3 h-3 mr-1" />
                    )}
                    {verifyingDoctorId === doctor._id ? 'Updating...' : 'Not Verified'}
                </button>
            );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Doctors ({doctors.length})
                </h2>
            </div>
            <div className="divide-y divide-gray-200">
                {doctors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No doctors found matching your criteria
                    </div>
                ) : (
                    doctors.map((doctor) => (
                        <div key={doctor._id} className="p-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-lg">
                                            {doctor.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center">
                                                <Award className="w-3 h-3 mr-1" />
                                                {doctor.speciality}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {doctor.experience} exp
                                            </span>
                                            <span className="flex items-center">
                                                <Mail className="w-3 h-3 mr-1" />
                                                {doctor.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center">
                                                <Shield className="w-3 h-3 mr-1" />
                                                License: {doctor.licenseNumber}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {getStatusBadge(doctor)}
                                    <button
                                        onClick={() => onViewDetails(doctor)}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
