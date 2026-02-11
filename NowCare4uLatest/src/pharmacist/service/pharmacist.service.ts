

const API_BASE = 'https://nowcare4-u-production-acbz.vercel.app/api/pharmacist';

export const pharmacistService = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    },

    register: async (formData: FormData) => {
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            // No Content-Type header needed for FormData, browser sets it with boundary
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        return data;
    },

    getProfile: async (token: string) => {
        const response = await fetch(`${API_BASE}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch profile');
        }
        return data;
    },

    updateProfile: async (token: string, data: FormData) => {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
                // No Content-Type for FormData, let browser set boundary
            },
            body: data
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to update profile');
        }
        return responseData;
    }
};
