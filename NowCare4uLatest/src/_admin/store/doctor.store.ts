import { create } from 'zustand';
import type { Doctor } from '../types/doctor.types';
import { doctorService } from '../service/doctor.service';

interface DoctorStore {
    doctors: Doctor[];
    loading: boolean;
    error: string | null;
    fetchDoctors: (token: string) => Promise<void>;
    updateDoctor: (doctorId: string, updates: Partial<Doctor>) => void;
    addDoctor: (doctor: Doctor) => void;
}

export const useDoctorStore = create<DoctorStore>((set) => ({
    doctors: [],
    loading: false,
    error: null,

    fetchDoctors: async (token: string) => {
        set({ loading: true, error: null });
        try {
            const doctors = await doctorService.getDoctors(token);
            set({ doctors, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch doctors',
                loading: false,
            });
        }
    },

    updateDoctor: (doctorId: string, updates: Partial<Doctor>) => {
        set(state => ({
            doctors: state.doctors.map(doctor =>
                doctor._id === doctorId ? { ...doctor, ...updates } : doctor
            ),
        }));
    },

    addDoctor: (doctor: Doctor) => {
        set(state => ({
            doctors: [doctor, ...state.doctors],
        }));
    },
}));
