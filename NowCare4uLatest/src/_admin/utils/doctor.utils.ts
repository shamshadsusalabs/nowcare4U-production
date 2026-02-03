import type { Doctor } from '../types/doctor.types';

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const filterDoctors = (
    doctors: Doctor[],
    searchTerm: string,
    statusFilter: string
): Doctor[] => {
    let filtered = doctors;

    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(doctor =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(doctor => {
            if (statusFilter === 'approved') return doctor.isVerified;
            if (statusFilter === 'pending') return !doctor.isVerified;
            if (statusFilter === 'rejected') return doctor.rejectionReason;
            return true;
        });
    }

    return filtered;
};
