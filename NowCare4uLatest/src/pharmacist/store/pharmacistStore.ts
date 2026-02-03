import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PharmacistState } from '../types'
import { pharmacistService } from '../service/pharmacist.service'

interface PharmacistActions {
    login: (email: string, password: string) => Promise<boolean>
    register: (formData: FormData) => Promise<boolean>
    logout: () => void
    checkAuth: () => Promise<void>
    updateProfile: (data: FormData) => Promise<boolean>
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const usePharmacistStore = create<PharmacistState & PharmacistActions>()(
    persist(
        (set, get) => ({
            // Initial state
            pharmacist: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            // Actions
            login: async (email, password) => {
                set({ loading: true, error: null })
                try {
                    const data = await pharmacistService.login(email, password)
                    if (data.success) {
                        set({
                            pharmacist: data.pharmacist,
                            token: data.token,
                            isAuthenticated: true,
                            loading: false
                        })
                        return true
                    } else {
                        set({ error: data.message, loading: false })
                        return false
                    }
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Login failed', loading: false })
                    return false
                }
            },

            register: async (formData) => {
                set({ loading: true, error: null })
                try {
                    const data = await pharmacistService.register(formData)
                    if (data.success) { // Assuming backend returns success: true and data
                        // Usually registration might require approval or direct login? 
                        // Doctor registration logged them in. I'll assume similar if backend supports it.
                        set({
                            pharmacist: data.pharmacist,
                            token: data.token,
                            isAuthenticated: true,
                            loading: false
                        })
                        return true
                    } else {
                        set({ error: data.message, loading: false })
                        return false
                    }
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Registration failed', loading: false })
                    return false
                }
            },

            logout: () => {
                set({
                    pharmacist: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                })
            },

            checkAuth: async () => {
                const { token } = get()
                if (!token) return

                try {
                    const data = await pharmacistService.getProfile(token)
                    // Assuming structure { pharmacist: ... }
                    if (data && data.pharmacist) {
                        set({ pharmacist: data.pharmacist, isAuthenticated: true })
                    } else {
                        get().logout()
                    }
                } catch (error) {
                    get().logout()
                }
            },

            updateProfile: async (data: FormData) => {
                const { token } = get()
                if (!token) return false

                set({ loading: true, error: null })
                try {
                    const response = await pharmacistService.updateProfile(token, data)
                    if (response.success) {
                        set({ pharmacist: response.pharmacist, loading: false })
                        return true
                    } else {
                        set({ error: response.message, loading: false })
                        return false
                    }
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Update failed', loading: false })
                    return false
                }
            },

            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error })
        }),
        {
            name: 'pharmacist-store',
            partialize: (state) => ({
                pharmacist: state.pharmacist,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
