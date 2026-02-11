import type { Doctor, DoctorFormData } from '../types/doctor.types';

const API_BASE = 'https://nowcare4-u-production-acbz.vercel.app/api/admin';

export const doctorService = {
    // Get all doctors
    async getDoctors(token: string): Promise<Doctor[]> {
        const response = await fetch(`${API_BASE}/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch doctors');
        return data.doctors || data;
    },

    // Create new doctor (auto-approved by admin)
    async createDoctor(token: string, formData: DoctorFormData): Promise<Doctor> {
        const response = await fetch(`${API_BASE}/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                isVerified: true, // Auto-approve when admin creates
                isApproved: true,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create doctor');
        return data.doctor || data;
    },

    // Toggle doctor verification status
    async updateVerificationStatus(
        token: string,
        doctorId: string,
        isVerified: boolean,
        rejectionReason?: string
    ): Promise<Doctor> {
        const response = await fetch(`${API_BASE}/doctors/${doctorId}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isVerified, rejectionReason }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update verification status');
        return data.doctor || data;
    },
};
