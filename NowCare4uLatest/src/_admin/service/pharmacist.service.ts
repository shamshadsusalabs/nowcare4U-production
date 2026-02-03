import type { Pharmacist, PharmacistFormData } from '../types/pharmacist.types';

const API_BASE = 'http://localhost:5000/api/admin';

export const pharmacistService = {
    // Get all pharmacists with pagination and filters
    async getPharmacists(
        token: string,
        params?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
            search?: string;
            status?: 'pending' | 'approved' | 'verified' | 'rejected';
        }
    ): Promise<{ pharmacists: Pharmacist[]; pagination: any }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);

        const response = await fetch(`${API_BASE}/pharmacists?${queryParams}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return { pharmacists: data.pharmacists, pagination: data.pagination };
    },

    // Create new pharmacist
    async createPharmacist(token: string, formData: PharmacistFormData): Promise<Pharmacist> {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('licenseNumber', formData.licenseNumber);
        formDataToSend.append('gstNumber', formData.gstNumber);
        formDataToSend.append('aadharNumber', formData.aadharNumber);
        formDataToSend.append('panNumber', formData.panNumber);
        formDataToSend.append('isApproved', 'true');
        formDataToSend.append('isVerified', 'true');

        if (formData.aadharFile) formDataToSend.append('aadharFile', formData.aadharFile);
        if (formData.panFile) formDataToSend.append('panFile', formData.panFile);
        if (formData.licenseFile) formDataToSend.append('licenseFile', formData.licenseFile);
        if (formData.gstFile) formDataToSend.append('gstFile', formData.gstFile);

        const response = await fetch(`${API_BASE}/pharmacists`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formDataToSend,
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.pharmacist;
    },

    // Update pharmacist approval status
    async updateApprovalStatus(
        token: string,
        pharmacistId: string,
        isApproved: boolean,
        rejectionReason?: string
    ): Promise<Pharmacist> {
        const response = await fetch(`${API_BASE}/pharmacists/${pharmacistId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isApproved, rejectionReason }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.pharmacist;
    },

    // Update pharmacist verification status
    async updateVerificationStatus(
        token: string,
        pharmacistId: string,
        isVerified: boolean,
        rejectionReason?: string
    ): Promise<Pharmacist> {
        const response = await fetch(`${API_BASE}/pharmacists/${pharmacistId}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isVerified, rejectionReason }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.pharmacist;
    },
};
