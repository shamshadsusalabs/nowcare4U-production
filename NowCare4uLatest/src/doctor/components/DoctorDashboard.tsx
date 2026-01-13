"use client"

import { useState, useEffect } from "react"
import { LogOut, User, Calendar, Clock, BarChart3, Settings } from "lucide-react"
import { useDoctorStore } from "../store/doctorStore"
import DoctorProfile from "./DoctorProfile"
import AvailabilityManager from "./AvailabilityManager"

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { doctor, bookings, fetchBookings, logout } = useDoctorStore()

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleLogout = () => {
    logout()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'appointments', label: 'Appointments', icon: Clock }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab doctor={doctor} bookings={bookings} />
      case 'profile':
        return <DoctorProfile />
      case 'availability':
        return <AvailabilityManager />
      case 'appointments':
        return <AppointmentsTab bookings={bookings} />
      default:
        return <OverviewTab doctor={doctor} bookings={bookings} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dr. {doctor?.name}</p>
                <p className="text-xs text-gray-500">{doctor?.speciality}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ doctor, bookings }: { doctor: any, bookings: any[] }) => {
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toDateString()
    const bookingDate = new Date(booking.appointmentDate).toDateString()
    return today === bookingDate
  })

  const stats = [
    {
      title: 'Total Appointments',
      value: bookings.length,
      color: 'bg-blue-500',
      icon: Calendar
    },
    {
      title: 'Today\'s Appointments',
      value: todayBookings.length,
      color: 'bg-green-500',
      icon: Clock
    },
    {
      title: 'Profile Status',
      value: doctor?.profileCompleted ? 'Complete' : 'Incomplete',
      color: doctor?.profileCompleted ? 'bg-green-500' : 'bg-yellow-500',
      icon: User
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, Dr. {doctor?.name}!</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Profile Completion Alert */}
        {!doctor?.profileCompleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Complete Your Profile</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please complete your profile to start receiving appointments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          </div>
          <div className="p-6">
            {todayBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todayBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{booking.patientName}</p>
                      <p className="text-sm text-gray-600">{booking.patientPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{booking.appointmentTime}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Appointments Tab Component
const AppointmentsTab = ({ bookings }: { bookings: any[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
      </div>
      <div className="p-6">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments yet</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{booking.patientName}</p>
                  <p className="text-sm text-gray-600">{booking.patientPhone}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.appointmentDate).toDateString()} at {booking.appointmentTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
