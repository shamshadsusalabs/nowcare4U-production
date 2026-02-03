import { create } from 'zustand';
import { productService } from '../service/product.service';
import type { Product } from '../types/product.types';
import { usePharmacistStore } from './pharmacistStore';

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;

    fetchMyProducts: () => Promise<void>;
    addProduct: (formData: FormData) => Promise<boolean>;
    updateProduct: (id: string, formData: FormData) => Promise<boolean>;
    deleteProduct: (id: string) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    loading: false,
    error: null,

    fetchMyProducts: async () => {
        const { token, pharmacist } = usePharmacistStore.getState();
        if (!token || !pharmacist) return;

        set({ loading: true, error: null });
        try {
            const data = await productService.getProducts(token, { pharmacistId: pharmacist.id });
            set({ products: data.products, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch products', loading: false });
        }
    },

    addProduct: async (formData: FormData) => {
        const { token } = usePharmacistStore.getState();
        if (!token) return false;

        set({ loading: true, error: null });
        try {
            const response = await productService.addProduct(token, formData);
            if (response.success) {
                // Determine if we should refetch or just push to state
                // Refetch is safer for consistency
                await get().fetchMyProducts();
                set({ loading: false });
                return true;
            }
            return false;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to add product', loading: false });
            return false;
        }
    },

    updateProduct: async (id: string, formData: FormData) => {
        const { token } = usePharmacistStore.getState();
        if (!token) return false;

        set({ loading: true, error: null });
        try {
            const response = await productService.updateProduct(token, id, formData);
            if (response.success) {
                await get().fetchMyProducts();
                set({ loading: false });
                return true;
            }
            return false;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update product', loading: false });
            return false;
        }
    },

    deleteProduct: async (id: string) => {
        const { token } = usePharmacistStore.getState();
        if (!token) return false;

        // Optimistic update
        const prevProducts = get().products;
        set({ products: prevProducts.filter(p => p._id !== id) });

        try {
            await productService.deleteProduct(token, id);
            return true;
        } catch (error) {
            // Revert on failure
            set({ products: prevProducts, error: error instanceof Error ? error.message : 'Failed to delete product' });
            return false;
        }
    }
}));
