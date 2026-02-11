

const API_BASE = 'https://nowcare4-u-production-acbz.vercel.app/api/products';

export const productService = {
    getProducts: async (token?: string, filters?: { pharmacistId?: string; search?: string; category?: string }) => {
        const queryParams = new URLSearchParams();
        if (filters?.pharmacistId) queryParams.append('pharmacistId', filters.pharmacistId);
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.category) queryParams.append('category', filters.category);

        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE}?${queryParams.toString()}`, {
            headers
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
        return data; // { products, total, pages, ... }
    },

    addProduct: async (token: string, formData: FormData) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to add product');
        return data;
    },

    updateProduct: async (token: string, id: string, formData: FormData) => {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update product');
        return data;
    },

    deleteProduct: async (token: string, id: string) => {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete product');
        return data;
    }
};
