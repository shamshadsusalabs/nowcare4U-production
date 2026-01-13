"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  LogOut,
  Phone,
  Award,
  Star,
  Stethoscope
} from "lucide-react"
import DoctorProfileForm from "./DoctorProfileForm"
import TimeSlotManager from "./TimeSlotManager"

interface Doctor {
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

interface Booking {
  _id: string
  patientName: string
  patientPhone: string
  appointmentDate: string
  appointmentTime: string
  status: string
  consultationType: string
}

interface DoctorDashboardProps {
  doctor: Doctor
  token: string
  onLogout: () => void
}

const DoctorDashboard = ({ doctor: initialDoctor, token, onLogout }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [doctor, setDoctor] = useState<Doctor>(initialDoctor)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(!initialDoctor.profileCompleted)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('doctorToken')
    onLogout()
  }

  const handleProfileUpdate = (updatedDoctor: Doctor) => {
    setDoctor(updatedDoctor)
    setIsEditingProfile(false)
    fetchBookings()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-500">NowCare4U</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dr. {doctor.name}</p>
                <p className="text-xs text-gray-500">{doctor.speciality}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Calendar },
            { id: 'profile', label: 'Profile', icon: Settings },
            { id: 'slots', label: 'Time Slots', icon: Clock },
            { id: 'appointments', label: 'Appointments', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome back, Dr. {doctor.name}!</h2>
              <p className="text-blue-100">
                {doctor.profileCompleted 
                  ? "Your profile is complete and ready for appointments" 
                  : "Please complete your profile to start receiving appointments"
                }
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => 
                        new Date(b.appointmentDate).toDateString() === new Date().toDateString() &&
                        b.status === 'confirmed'
                      ).length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{doctor.rating}</p>
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{booking.patientName}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {booking.patientPhone} • {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          isEditingProfile ? (
            <DoctorProfileForm 
              doctor={doctor} 
              token={token} 
              onUpdate={handleProfileUpdate}
              onCancel={() => setIsEditingProfile(false)}
            />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{doctor.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical License Number</label>
                  <p className="text-gray-900">{doctor.licenseNumber || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                  <p className="text-gray-900">{doctor.speciality || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-900">{doctor.experience || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{doctor.location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <p className="text-gray-900">{doctor.consultationFee || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                  <p className="text-gray-900">{doctor.languages?.join(', ') || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <p className="text-gray-900">{doctor.qualification || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )
        )}
        
        {activeTab === 'slots' && (
          <TimeSlotManager token={token} />
        )}
        
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Appointments</h3>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments yet</p>
                <p className="text-sm text-gray-400">Appointments will appear here once patients book with you</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.patientName}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {booking.patientPhone}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{booking.consultationType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
