"use client"

import { useState, useEffect } from "react"
import DoctorAuth from "./DoctorAuth"
import DoctorDashboard from "./DoctorDashboard"

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

const DoctorPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [token, setToken] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const savedToken = localStorage.getItem('doctorToken')

    if (savedToken) {
      try {
        const response = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/doctors/profile', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDoctor(data.doctor)
          setToken(savedToken)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('doctorToken')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('doctorToken')
      }
    }

    setLoading(false)
  }

  const handleAuthSuccess = (doctorData: Doctor, authToken: string) => {
    setDoctor(doctorData)
    setToken(authToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setDoctor(null)
    setToken("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !doctor) {
    return <DoctorAuth onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <DoctorDashboard
      doctor={doctor}
      token={token}
      onLogout={handleLogout}
    />
  )
}

export default DoctorPage
