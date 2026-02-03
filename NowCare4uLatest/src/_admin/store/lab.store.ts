import { create } from 'zustand';
import type { Lab } from '../types/lab.types';
import { labService } from '../service/lab.service';

interface LabStore {
    labs: Lab[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    } | null;
    fetchLabs: (token: string, params?: any) => Promise<void>;
    updateLab: (labId: string, updates: Partial<Lab>) => void;
    addLab: (lab: Lab) => void;
}

export const useLabStore = create<LabStore>((set) => ({
    labs: [],
    loading: false,
    error: null,
    pagination: null,

    fetchLabs: async (token: string, params?: any) => {
        set({ loading: true, error: null });
        try {
            const { labs, pagination } = await labService.getLabs(token, params);
            set({ labs, pagination, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch labs',
                loading: false,
            });
        }
    },

    updateLab: (labId: string, updates: Partial<Lab>) => {
        set(state => ({
            labs: state.labs.map(lab =>
                lab._id === labId ? { ...lab, ...updates } : lab
            ),
        }));
    },

    addLab: (lab: Lab) => {
        set(state => ({
            labs: [lab, ...state.labs],
        }));
    },
}));
