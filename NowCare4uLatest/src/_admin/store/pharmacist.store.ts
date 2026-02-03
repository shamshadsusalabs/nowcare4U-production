import { create } from 'zustand';
import type { Pharmacist } from '../types/pharmacist.types';
import { pharmacistService } from '../service/pharmacist.service';

interface PharmacistStore {
    pharmacists: Pharmacist[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    } | null;

    // Actions
    fetchPharmacists: (
        token: string,
        params?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
            search?: string;
            status?: 'pending' | 'approved' | 'verified' | 'rejected';
        }
    ) => Promise<void>;
    addPharmacist: (pharmacist: Pharmacist) => void;
    updatePharmacist: (id: string, updates: Partial<Pharmacist>) => void;
    clearCache: () => void;
}

export const usePharmacistStore = create<PharmacistStore>((set) => ({
    pharmacists: [],
    loading: false,
    error: null,
    lastFetched: null,
    pagination: null,

    fetchPharmacists: async (token: string, params) => {
        set({ loading: true, error: null });

        try {
            const { pharmacists, pagination } = await pharmacistService.getPharmacists(token, params);
            set({
                pharmacists,
                pagination,
                loading: false,
                lastFetched: Date.now(),
                error: null
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load pharmacists',
                loading: false
            });
        }
    },

    addPharmacist: (pharmacist: Pharmacist) => {
        set(state => ({
            pharmacists: [pharmacist, ...state.pharmacists]
        }));
    },

    updatePharmacist: (id: string, updates: Partial<Pharmacist>) => {
        set(state => ({
            pharmacists: state.pharmacists.map(p =>
                p._id === id ? { ...p, ...updates } : p
            )
        }));
    },

    clearCache: () => {
        set({ lastFetched: null });
    },
}));
