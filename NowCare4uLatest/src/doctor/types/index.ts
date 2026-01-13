export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  speciality: string
  languages: string[]
  qualification: string
  experience: string
  location: string
  consultationFee: string
  image: string
  profileCompleted: boolean
  rating: number
}

export interface TimeSlot {
  _id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  isAvailable: boolean
}

export interface Booking {
  _id: string
  patientName: string
  patientPhone: string
  appointmentDate: string
  appointmentTime: string
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  consultationType: 'online' | 'in-person'
}

export interface DoctorState {
  doctor: Doctor | null
  token: string | null
  isAuthenticated: boolean
  timeSlots: TimeSlot[]
  bookings: Booking[]
  loading: boolean
  error: string | null
}
