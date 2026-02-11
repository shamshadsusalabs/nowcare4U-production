"use client"

import { useState } from "react"
import { User, MapPin, Award, Globe, DollarSign, Phone, FileText, XCircle } from "lucide-react"

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

interface DoctorProfileFormProps {
  doctor: Doctor
  token: string
  onUpdate: (doctor: Doctor) => void
  onCancel: () => void
}

const DoctorProfileForm = ({ doctor, token, onUpdate, onCancel }: DoctorProfileFormProps) => {
  console.log('Doctor data received in profile form:', doctor);
  console.log('License number from doctor:', doctor.licenseNumber);
  console.log('All doctor keys:', Object.keys(doctor));

  const [formData, setFormData] = useState({
    name: doctor.name || '',
    licenseNumber: doctor.licenseNumber || '',
    speciality: doctor.speciality || '',
    languages: doctor.languages || [],
    qualification: doctor.qualification || '',
    experience: doctor.experience || '',
    location: doctor.location || '',
    consultationFee: doctor.consultationFee || '',
    phone: doctor.phone || '',
    image: doctor.image || ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [newLanguage, setNewLanguage] = useState('')

  const commonLanguages = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu']

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.speciality.trim()) newErrors.speciality = 'Speciality is required'
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required'
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.consultationFee.trim()) newErrors.consultationFee = 'Consultation fee is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (formData.languages.length === 0) newErrors.languages = 'At least one language is required'

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/doctors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        onUpdate(data.doctor)
      } else {
        setErrors({ general: data.message || 'Update failed' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const addLanguage = (lang: string) => {
    if (lang && !formData.languages.includes(lang)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, lang]
      }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-2" />
              Medical License Number
            </label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your medical license number"
              required
              minLength={5}
            />
            <p className="text-xs text-gray-500 mt-1">Debug: {formData.licenseNumber || 'No license number'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="+91 9876543210"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-2" />
              Speciality
            </label>
            <input
              type="text"
              name="speciality"
              value={formData.speciality}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.speciality ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., Cardiologist, Pediatrician"
            />
            {errors.speciality && <p className="text-red-500 text-sm mt-1">{errors.speciality}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-2" />
              Experience
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., 10+ Years"
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., Mumbai, India"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Consultation Fee
            </label>
            <input
              type="text"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.consultationFee ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., ₹1000"
            />
            {errors.consultationFee && <p className="text-red-500 text-sm mt-1">{errors.consultationFee}</p>}
          </div>
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Qualification
          </label>
          <textarea
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.qualification ? 'border-red-500' : 'border-gray-300'
              }`}
            rows={3}
            placeholder="e.g., MBBS, MD Cardiology from AIIMS"
          />
          {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Languages Spoken
          </label>

          {/* Selected Languages */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.languages.map((lang) => (
              <span
                key={lang}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Language */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add custom language"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addLanguage(newLanguage)
                }
              }}
            />
            <button
              type="button"
              onClick={() => addLanguage(newLanguage)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add
            </button>
          </div>

          {/* Common Languages */}
          <div className="flex flex-wrap gap-2">
            {commonLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => addLanguage(lang)}
                disabled={formData.languages.includes(lang)}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${formData.languages.includes(lang)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
          {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
        </div>

        {/* Profile Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image URL (Optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving Profile...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default DoctorProfileForm
