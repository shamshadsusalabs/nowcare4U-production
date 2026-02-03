import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LabState } from '../types'
import { labService } from '../service/lab.service'

interface LabActions {
    login: (email: string, password: string) => Promise<boolean>
    register: (formData: FormData) => Promise<boolean>
    logout: () => void
    checkAuth: () => Promise<void>
    updateProfile: (data: FormData) => Promise<boolean>
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useLabStore = create<LabState & LabActions>()(
    persist(
        (set, get) => ({
            // Initial state
            lab: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            // Actions
            login: async (email, password) => {
                set({ loading: true, error: null })
                try {
                    const data = await labService.login(email, password)
                    if (data.success) {
                        set({
                            lab: data.data, // Backend sends user data in 'data' field usually, key is usually 'data' based on controller
                            token: data.data.token,
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
                    const data = await labService.register(formData)
                    if (data.success) {
                        // Registration successful
                        // Depending on backend, might not login immediately if approval needed
                        set({ loading: false })
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
                    lab: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                })
            },

            checkAuth: async () => {
                const { token } = get()
                if (!token) return

                try {
                    const data = await labService.getProfile(token)
                    if (data && data.success) {
                        set({ lab: data.data, isAuthenticated: true })
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
                    const response = await labService.updateProfile(token, data)
                    if (response.success) {
                        set({ lab: response.data, loading: false }) // Backend typically returns updated doc in data
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
            name: 'lab-store',
            partialize: (state) => ({
                lab: state.lab,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
