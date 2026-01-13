"use client"

import { useState, useEffect } from "react"
import { User, MapPin, Phone, GraduationCap, Clock, DollarSign, Languages, FileText, CheckCircle, XCircle } from "lucide-react"
import { useDoctorStore } from "../store/doctorStore"

const DoctorProfile = () => {
  const { doctor, updateProfile, loading } = useDoctorStore()
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    speciality: '',
    languages: '',
    qualification: '',
    experience: '',
    location: '',
    consultationFee: '',
    image: '',
    licenseNumber: ''
  })

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        phone: doctor.phone || '',
        speciality: doctor.speciality || '',
        languages: doctor.languages?.join(', ') || '',
        qualification: doctor.qualification || '',
        experience: doctor.experience || '',
        location: doctor.location || '',
        consultationFee: doctor.consultationFee || '',
        image: doctor.image || '',
        licenseNumber: doctor.licenseNumber || ''
      })
    }
  }, [doctor])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const profileData = {
      ...formData,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
    }
    
    const success = await updateProfile(profileData)
    
    if (success) {
      setNotification({
        type: 'success',
        message: 'Profile updated successfully! ✅'
      })
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      })
    }
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const specialties = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Gynecology', 'Psychiatry', 'Ophthalmology', 'ENT', 'General Medicine'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-3" />
            Doctor Profile
          </h2>
          <p className="text-blue-100 mt-2">Complete your professional details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Notification */}
          {notification && (
            <div className={`p-4 rounded-xl border-2 flex items-center space-x-3 ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{notification.message}</span>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speciality</label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                required
              >
                <option value="">Select Speciality</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="English, Hindi, Tamil"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Separate languages with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="MBBS, MD"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="5 years"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="Mumbai, Maharashtra"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="MH123456789"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoctorProfile
