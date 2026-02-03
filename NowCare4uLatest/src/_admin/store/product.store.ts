import { create } from 'zustand';
import { adminProductService } from '../service/product.service';
import type { AdminProduct } from '../types/product.types';

interface ProductState {
    products: AdminProduct[];
    loading: boolean;
    error: string | null;
    fetchProducts: (token: string) => Promise<void>;
    deleteProduct: (token: string, id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async (token: string) => {
        set({ loading: true, error: null });
        try {
            const products = await adminProductService.getAllProducts(token);
            set({ products, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch products', loading: false });
        }
    },

    deleteProduct: async (token: string, id: string) => {
        // Optimistic update
        const prevProducts = get().products;
        set({ products: prevProducts.filter(p => p._id !== id) });

        try {
            await adminProductService.deleteProduct(token, id);
        } catch (error) {
            // Revert
            set({ products: prevProducts, error: error instanceof Error ? error.message : 'Failed to delete' });
        }
    }
}));
