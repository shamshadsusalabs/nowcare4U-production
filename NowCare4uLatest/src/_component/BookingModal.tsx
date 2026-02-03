"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Phone, CheckCircle } from "lucide-react"

interface TimeSlot {
  _id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  isAvailable: boolean
}

interface Doctor {
  _id: string
  name: string
  speciality: string
  languages?: string[]
  qualification?: string
  availability?: string
  rating?: number
  experience?: string
  consultationFee: string
  image: string
  location: string
  nextAvailable?: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor
}

const BookingModal = ({ isOpen, onClose, doctor }: BookingModalProps) => {
  const [step, setStep] = useState(1) // 1: Select slot, 2: Patient details, 3: Confirmation
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [patientData, setPatientData] = useState({
    name: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSlots()
    }
  }, [isOpen, doctor._id])

  const fetchAvailableSlots = async () => {
    try {
      console.log('Fetching slots for doctor ID:', doctor._id)
      // Use the correct API endpoint for public available slots
      const response = await fetch(`http://localhost:5000/api/public/doctors/${doctor._id}/available-slots`)
      const data = await response.json()
      console.log('Available slots response:', data)
      if (data.success) {
        // Filter slots to show only current date and future dates (up to 1 week)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to start of today

        const oneWeekFromNow = new Date()
        oneWeekFromNow.setDate(today.getDate() + 7)
        oneWeekFromNow.setHours(23, 59, 59, 999) // Set to end of the day

        const filteredSlots = (data.availableSlots || []).filter((slot: TimeSlot) => {
          const slotDate = new Date(slot.date)
          slotDate.setHours(0, 0, 0, 0) // Set to start of slot date for comparison

          // Only show slots from today onwards and within 1 week
          return slotDate >= today && slotDate <= oneWeekFromNow
        })

        setAvailableSlots(filteredSlots)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedSlot || !patientData.name || !patientData.phone) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          timeSlotId: selectedSlot._id,
          patientName: patientData.name,
          patientPhone: patientData.phone
        })
      })

      const data = await response.json()
      if (data.success) {
        setBooking(data.booking)
        setStep(3)
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setSelectedSlot(null)
    setPatientData({ name: '', phone: '' })
    setBooking(null)
    onClose()
  }

  if (!isOpen) return null

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const date = new Date(slot.date).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Book Appointment</h2>
              <p className="text-blue-100">with Dr. {doctor.name}</p>
            </div>
            <button
              onClick={resetModal}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= stepNum ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                  }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 ${step > stepNum ? 'bg-white' : 'bg-white/20'
                    }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Select Time Slot */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Select Available Time Slot</h3>

              {Object.keys(slotsByDate).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No available slots at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(slotsByDate).map(([date, slots]) => (
                    <div key={date} className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot._id}
                            onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                            disabled={slot.isBooked}
                            className={`p-3 rounded-lg border transition-all duration-200 ${slot.isBooked
                              ? 'bg-red-100 text-red-700 border-red-200 cursor-not-allowed opacity-60'
                              : selectedSlot?._id === slot._id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300 text-green-800'
                              }`}
                          >
                            <div className="text-sm font-medium">{slot.startTime}</div>
                            <div className="text-xs opacity-75">to {slot.endTime}</div>
                            {slot.isBooked && (
                              <div className="text-xs text-red-600 font-medium mt-1">Booked</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedSlot}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Patient Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>

              {/* Selected slot info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 font-medium">Selected Appointment</p>
                <p className="text-blue-900 font-semibold">
                  {selectedSlot && new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot?.startTime}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={patientData.name}
                      onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!patientData.name || !patientData.phone || loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && booking && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Confirmed!</h3>
                <p className="text-gray-600">Your appointment has been successfully booked</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">Appointment Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Doctor:</span> Dr. {doctor.name}</p>
                  <p><span className="font-medium">Patient:</span> {booking.patientName}</p>
                  <p><span className="font-medium">Date:</span> {new Date(booking.appointmentDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {booking.appointmentTime}</p>
                  <p><span className="font-medium">Fee:</span> {doctor.consultationFee}</p>
                  <p><span className="font-medium">Contact:</span> {booking.patientPhone}</p>
                </div>
              </div>

              <button
                onClick={resetModal}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
