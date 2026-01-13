"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { useDoctorStore } from "../store/doctorStore"
import type { TimeSlot } from "../types"

const AvailabilityManager = () => {
  const { timeSlots, createTimeSlots, fetchTimeSlots, toggleSlotAvailability, loading } = useDoctorStore()
  
  const [selectedDate, setSelectedDate] = useState('')
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)

  useEffect(() => {
    fetchTimeSlots()
  }, [fetchTimeSlots])

  // Debug: Log timeSlots to see what we're getting
  useEffect(() => {
    console.log('TimeSlots in component:', timeSlots)
    console.log('Grouped slots:', groupSlotsByDate(timeSlots))
  }, [timeSlots])

  const handleCreateSlots = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && startHour < endHour) {
      await createTimeSlots(selectedDate, startHour, endHour)
      setSelectedDate('')
      setStartHour(9)
      setEndHour(17)
    }
  }

  const handleToggleAvailability = async (slotId: string, currentAvailability: boolean) => {
    await toggleSlotAvailability(slotId, !currentAvailability)
  }

  const formatTime = (hour: number, minute: number = 0) => {
    const time = new Date()
    time.setHours(hour, minute)
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    return slots.reduce((acc, slot) => {
      const date = new Date(slot.date).toDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(slot)
      return acc
    }, {} as Record<string, TimeSlot[]>)
  }

  const groupedSlots = groupSlotsByDate(timeSlots)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Create New Slots */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Plus className="w-6 h-6 mr-3" />
            Create Availability Slots
          </h2>
          <p className="text-green-100 mt-2">Add new time slots for appointments</p>
        </div>

        <form onSubmit={handleCreateSlots} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {formatTime(i)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i} disabled={i <= startHour}>
                    {formatTime(i)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !selectedDate}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Slots...</span>
                </div>
              ) : (
                'Create Time Slots'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Slots */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Clock className="w-6 h-6 mr-3" />
            Manage Time Slots
          </h2>
          <p className="text-purple-100 mt-2">Toggle availability for your slots</p>
        </div>

        <div className="p-6">
          {timeSlots.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No time slots created yet</p>
              <p className="text-gray-400">Create your first availability slots above</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([date, slots]: [string, TimeSlot[]]) => (
                <div key={date} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">{date}</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {slots.map((slot) => (
                        <div
                          key={slot._id}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            slot.isBooked
                              ? 'bg-red-50 border-red-200 cursor-not-allowed'
                              : slot.isAvailable
                              ? 'bg-green-50 border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-800 mb-2">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              slot.isBooked
                                ? 'bg-red-100 text-red-700'
                                : slot.isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {slot.isBooked ? 'Booked' : slot.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                            {!slot.isBooked && (
                              <button
                                onClick={() => handleToggleAvailability(slot._id, slot.isAvailable)}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                {slot.isAvailable ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvailabilityManager
