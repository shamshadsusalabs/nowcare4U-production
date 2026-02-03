import type { AdminProduct } from '../types/product.types';

const API_BASE = 'http://localhost:5000/api/products';

export const adminProductService = {
    getAllProducts: async (token: string) => {
        // Admin token can be passed, though endpoint is public currently.
        // Good to pass it if we add admin-specific protection later.
        const response = await fetch(API_BASE, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
        return data.products as AdminProduct[];
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
