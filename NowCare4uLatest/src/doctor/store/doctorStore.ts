import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Doctor } from '../types/index'

interface TimeSlot {
  _id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  isAvailable: boolean
}

interface Booking {
  _id: string
  patientName: string
  patientPhone: string
  appointmentDate: string
  appointmentTime: string
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  consultationType: 'online' | 'in-person'
}

interface DoctorState {
  doctor: Doctor | null
  token: string | null
  isAuthenticated: boolean
  timeSlots: TimeSlot[]
  bookings: Booking[]
  loading: boolean
  error: string | null
}

interface DoctorActions {
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone: string, licenseNumber: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>

  // Profile actions
  updateProfile: (profileData: Partial<Doctor>) => Promise<boolean>

  // Time slot actions
  createTimeSlots: (date: string, startHour: number, endHour: number) => Promise<boolean>
  fetchTimeSlots: () => Promise<void>
  toggleSlotAvailability: (slotId: string, isAvailable: boolean) => Promise<boolean>

  // Booking actions
  fetchBookings: () => Promise<void>

  // Utility actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const API_BASE = 'http://localhost:5000/api'

export const useDoctorStore = create<DoctorState & DoctorActions>()(
  persist(
    (set, get) => ({
      // Initial state
      doctor: null,
      token: null,
      isAuthenticated: false,
      timeSlots: [],
      bookings: [],
      loading: false,
      error: null,

      // Auth actions
      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/doctors/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })

          const data = await response.json()

          if (data.success) {
            set({
              doctor: data.doctor,
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
          set({ error: 'Network error', loading: false })
          return false
        }
      },

      register: async (name: string, email: string, password: string, phone: string, licenseNumber: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/doctors/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, licenseNumber })
          })

          const data = await response.json()

          if (data.success) {
            set({
              doctor: data.doctor,
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
          set({ error: 'Network error', loading: false })
          return false
        }
      },

      logout: () => {
        set({
          doctor: null,
          token: null,
          isAuthenticated: false,
          timeSlots: [],
          bookings: [],
          error: null
        })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch(`${API_BASE}/doctors/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (response.ok) {
            const data = await response.json()
            set({ doctor: data.doctor, isAuthenticated: true })
          } else {
            get().logout()
          }
        } catch (error) {
          get().logout()
        }
      },

      // Profile actions
      updateProfile: async (profileData: Partial<Doctor>) => {
        const { token } = get()
        if (!token) return false

        set({ loading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/doctors/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
          })

          const data = await response.json()

          if (data.success) {
            set({ doctor: data.doctor, loading: false })
            return true
          } else {
            set({ error: data.message, loading: false })
            return false
          }
        } catch (error) {
          set({ error: 'Network error', loading: false })
          return false
        }
      },

      // Time slot actions
      createTimeSlots: async (date: string, startHour: number, endHour: number) => {
        const { token } = get()
        if (!token) return false

        set({ loading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/doctors/time-slots`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ date, startHour, endHour })
          })

          const data = await response.json()

          if (data.success) {
            await get().fetchTimeSlots()
            set({ loading: false })
            return true
          } else {
            set({ error: data.message, loading: false })
            return false
          }
        } catch (error) {
          set({ error: 'Network error', loading: false })
          return false
        }
      },

      fetchTimeSlots: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch(`${API_BASE}/doctors/time-slots`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (response.ok) {
            const data = await response.json()
            console.log('Fetched time slots:', data)
            set({ timeSlots: data.slots || [] })
          }
        } catch (error) {
          console.error('Error fetching time slots:', error)
        }
      },

      toggleSlotAvailability: async (slotId: string, isAvailable: boolean) => {
        const { token } = get()
        if (!token) return false

        try {
          const response = await fetch(`${API_BASE}/doctors/time-slots/${slotId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isAvailable })
          })

          if (response.ok) {
            await get().fetchTimeSlots()
            return true
          }
          return false
        } catch (error) {
          return false
        }
      },

      // Booking actions
      fetchBookings: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch(`${API_BASE}/doctors/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (response.ok) {
            const data = await response.json()
            set({ bookings: data.bookings })
          }
        } catch (error) {
          console.error('Error fetching bookings:', error)
        }
      },

      // Utility actions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error })
    }),
    {
      name: 'doctor-store',
      partialize: (state) => ({
        doctor: state.doctor,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
