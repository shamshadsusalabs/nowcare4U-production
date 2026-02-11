import type { Lab, LabFormData, LabTest } from '../types/lab.types';

const API_BASE = 'https://nowcare4-u-production-acbz.vercel.app/api/admin';

export const labService = {
    // Get all labs with pagination and filters
    async getLabs(
        token: string,
        params?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
            search?: string;
            status?: 'pending' | 'approved' | 'verified' | 'rejected';
        }
    ): Promise<{ labs: Lab[]; pagination: any }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);

        const response = await fetch(`${API_BASE}/labs?${queryParams}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return { labs: data.labs, pagination: data.pagination };
    },

    // Create new lab
    async createLab(token: string, formData: LabFormData): Promise<Lab> {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('labLicenseNumber', formData.labLicenseNumber);
        formDataToSend.append('gstNumber', formData.gstNumber);
        formDataToSend.append('aadharNumber', formData.aadharNumber);
        formDataToSend.append('panNumber', formData.panNumber);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('state', formData.state);
        formDataToSend.append('pincode', formData.pincode);
        formDataToSend.append('isApproved', 'true');
        formDataToSend.append('isVerified', 'true');

        if (formData.aadharFile) formDataToSend.append('aadharFile', formData.aadharFile);
        if (formData.panFile) formDataToSend.append('panFile', formData.panFile);
        if (formData.labLicenseFile) formDataToSend.append('labLicenseFile', formData.labLicenseFile);
        if (formData.gstFile) formDataToSend.append('gstFile', formData.gstFile);

        const response = await fetch(`${API_BASE}/labs`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formDataToSend,
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.lab;
    },

    // Update lab approval status
    async updateApprovalStatus(
        token: string,
        labId: string,
        isApproved: boolean,
        rejectionReason?: string
    ): Promise<Lab> {
        const response = await fetch(`${API_BASE}/labs/${labId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isApproved, rejectionReason }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.lab;
    },

    // Update lab verification status
    async updateVerificationStatus(
        token: string,
        labId: string,
        isVerified: boolean,
        rejectionReason?: string
    ): Promise<Lab> {
        const response = await fetch(`${API_BASE}/labs/${labId}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isVerified, rejectionReason }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.lab;
    },

    // Get services for a specific lab
    async getLabServices(token: string, labId: string): Promise<LabTest[]> {
        const response = await fetch(`${API_BASE}/labs/${labId}/services`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.services;
    },
};
