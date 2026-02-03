
const API_BASE = 'http://localhost:5000/api/labs';
const SERVICE_API_BASE = 'http://localhost:5000/api/lab-services';

export const labService = {
    // Auth & Profile
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
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
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
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to update profile');
        }
        return responseData;
    },

    // Service Management
    getMyServices: async (token: string) => {
        const response = await fetch(`${SERVICE_API_BASE}/my/services`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch services');
        return data;
    },

    createService: async (token: string, serviceData: any) => {
        const response = await fetch(`${SERVICE_API_BASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(serviceData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create service');
        return data;
    },

    updateService: async (token: string, id: string, serviceData: any) => {
        const response = await fetch(`${SERVICE_API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(serviceData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update service');
        return data;
    },

    deleteService: async (token: string, id: string) => {
        const response = await fetch(`${SERVICE_API_BASE}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete service');
        return data;
    }
};
