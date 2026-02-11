"use client"

import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Globe,
  Award,
  Calendar,
  Filter,
  MapPin,
  X,
  FileText
} from "lucide-react"
import BookingModal from "./BookingModal"

interface Doctor {
  _id: string
  name: string
  speciality: string
  languages?: string[]
  qualification: string
  experience: string
  rating: number
  image: string
  location: string
  consultationFee: string
  profileCompleted: boolean
}

const DoctorDetailsModal = ({ isOpen, onClose, doctor }: { isOpen: boolean, onClose: () => void, doctor: Doctor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Doctor Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative shrink-0 mx-auto md:mx-0">
              <img
                src={doctor.image || '/api/placeholder/150/150'}
                alt={doctor.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
              <p className="text-blue-600 font-medium text-lg mb-3">{doctor.speciality}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(5.0)</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-3 text-blue-700">
                <Clock className="w-5 h-5" />
                <h4 className="font-bold text-lg">Experience</h4>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{doctor.experience}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-center gap-3 mb-3 text-purple-700">
                  <Award className="w-5 h-5" />
                  <h4 className="font-bold text-lg">Qualification</h4>
                </div>
                <p className="text-gray-700 font-medium">{doctor.qualification}</p>
              </div>

              <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100">
                <div className="flex items-center gap-3 mb-3 text-orange-700">
                  <Globe className="w-5 h-5" />
                  <h4 className="font-bold text-lg">Languages</h4>
                </div>
                <p className="text-gray-700 font-medium">{doctor.languages?.join(", ") || "Hindi, English"}</p>
              </div>

              <div className="bg-red-50/50 rounded-2xl p-5 border border-red-100">
                <div className="flex items-center gap-3 mb-3 text-red-700">
                  <MapPin className="w-5 h-5" />
                  <h4 className="font-bold text-lg">Location</h4>
                </div>
                <p className="text-gray-700 font-medium">{doctor.location}</p>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                <div className="flex items-center gap-3 mb-3 text-emerald-700">
                  <FileText className="w-5 h-5" />
                  <h4 className="font-bold text-lg">Consultation Fee</h4>
                </div>
                <p className="text-2xl font-bold text-emerald-600">₹{doctor.consultationFee}</p>
                <p className="text-xs text-gray-500">per session</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 z-20">
          <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const DoctorCard = ({ doctor, onBookAppointment, onViewDetails }: { doctor: Doctor, onBookAppointment: (doctor: Doctor) => void, onViewDetails: (doctor: Doctor) => void }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1 h-full flex flex-col">
      {/* Header with specialty background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
            <p className="text-blue-100 text-sm font-medium">{doctor.speciality}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold">Available</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 flex-grow flex flex-col">
        {/* Doctor Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative shrink-0">
            <img
              src={doctor.image || '/api/placeholder/100/100'}
              alt={doctor.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">(5.0)</span>
            </div>
          </div>
        </div>

        {/* Doctor Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-blue-600 mb-1">
              <Award className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold uppercase tracking-wide">Qualification</span>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate" title={doctor.qualification}>{doctor.qualification}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center text-green-600 mb-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold uppercase tracking-wide">Experience</span>
            </div>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{doctor.experience}</p>
            {doctor.experience && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(doctor);
                }}
                className="text-xs text-blue-600 font-semibold mt-auto pt-1 hover:underline text-left"
              >
                Read More
              </button>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-red-600 mb-1">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold uppercase tracking-wide">Location</span>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate" title={doctor.location}>{doctor.location}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-purple-600 mb-1">
              <Globe className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold uppercase tracking-wide">Languages</span>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate" title={doctor.languages?.join(", ") || "Hindi, English"}>{doctor.languages?.join(", ") || "Hindi, English"}</p>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="mt-auto bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-6 border border-emerald-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Consultation Fee</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-emerald-600">₹{doctor.consultationFee}</span>
              <p className="text-xs text-gray-500">per session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className="relative z-10 p-6 pt-0 mt-auto">
        <button
          onClick={() => onBookAppointment(doctor)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <Calendar className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  )
}

const ExpertList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDoctorForDetails, setSelectedDoctorForDetails] = useState<Doctor | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const doctorsPerPage = 6

  // Fetch doctors and specialties
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [doctorsRes, specialtiesRes] = await Promise.all([
          fetch('https://nowcare4-u-production-acbz.vercel.app/api/public/doctors'),
          fetch('https://nowcare4-u-production-acbz.vercel.app/api/public/specialties')
        ])

        if (doctorsRes.ok) {
          const doctorsData = await doctorsRes.json()
          setDoctors(doctorsData.doctors || [])
        }

        if (specialtiesRes.ok) {
          const specialtiesData = await specialtiesRes.json()
          setSpecialties(['All', ...(specialtiesData.specialties || [])])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors.filter(doctor => doctor.profileCompleted)

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSpecialty !== "All") {
      filtered = filtered.filter(doctor => doctor.speciality === selectedSpecialty)
    }

    setFilteredDoctors(filtered)
    setCurrentPage(1)
  }, [doctors, searchTerm, selectedSpecialty])

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)
  const startIndex = (currentPage - 1) * doctorsPerPage
  const currentDoctors = filteredDoctors.slice(startIndex, startIndex + doctorsPerPage)

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowBookingModal(true)
  }

  const handleCloseModal = () => {
    setShowBookingModal(false)
    setSelectedDoctor(null)
  }

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctorForDetails(doctor)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedDoctorForDetails(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Expert Doctors - NowCare4U</title>
        <meta name="description" content="Find and book appointments with expert doctors across various specialties" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Expert Doctors
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with qualified healthcare professionals for personalized medical care
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-12 border border-white/50">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, specialty, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Specialty Filter */}
              <div className="lg:w-64">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-white"
                  >
                    {specialties.map((specialty, index) => (
                      <option key={`${specialty}-${index}`} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {currentDoctors.length} of {filteredDoctors.length} doctors
            </p>
          </div>

          {/* Doctors Grid */}
          {currentDoctors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No doctors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr">
              {currentDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 text-gray-700 hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-semibold transition-all duration-300 ${currentPage === i + 1
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/50"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 text-gray-700 hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedDoctor && (
          <BookingModal
            isOpen={showBookingModal}
            doctor={{
              _id: selectedDoctor._id,
              name: selectedDoctor.name,
              speciality: selectedDoctor.speciality,
              languages: selectedDoctor.languages || ['Hindi', 'English'],
              qualification: selectedDoctor.qualification,
              availability: 'Available',
              rating: selectedDoctor.rating,
              image: selectedDoctor.image,
              experience: selectedDoctor.experience,
              location: selectedDoctor.location,
              consultationFee: selectedDoctor.consultationFee,
              nextAvailable: 'Today'
            }}
            onClose={handleCloseModal}
          />
        )}

        {/* Doctor Details Modal */}
        {showDetailsModal && selectedDoctorForDetails && (
          <DoctorDetailsModal
            isOpen={showDetailsModal}
            doctor={selectedDoctorForDetails}
            onClose={handleCloseDetailsModal}
          />
        )}
      </div>
    </>
  )
}

export default ExpertList
