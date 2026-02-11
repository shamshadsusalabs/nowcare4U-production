"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

interface TimeSlot {
  _id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  isAvailable: boolean
}

interface TimeSlotManagerProps {
  token: string
}

const TimeSlotManager = ({ token }: TimeSlotManagerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    date: '',
    startHour: 9,
    endHour: 17
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTimeSlots()
  }, [])

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/doctors/time-slots', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTimeSlots(data.slots)
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    }
  }

  const handleCreateSlots = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/doctors/time-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      })

      if (response.ok) {
        setShowCreateForm(false)
        setCreateForm({ date: '', startHour: 9, endHour: 17 })
        fetchTimeSlots()
      }
    } catch (error) {
      console.error('Error creating slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSlotAvailability = async (slotId: string, currentAvailability: boolean) => {
    try {
      const response = await fetch(`https://nowcare4-u-production-acbz.vercel.app/api/doctors/time-slots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentAvailability })
      })

      if (response.ok) {
        fetchTimeSlots()
      }
    } catch (error) {
      console.error('Error updating slot:', error)
    }
  }

  // Group slots by date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const date = new Date(slot.date).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Time Slot Management</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Create Slots</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Create Time Slots</h4>
          <p className="text-gray-600 mb-4">Create 15-minute time slots for the selected date and time range.</p>

          <form onSubmit={handleCreateSlots} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Hour</label>
                <select
                  value={createForm.startHour}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, startHour: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Hour</label>
                <select
                  value={createForm.endHour}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, endHour: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Slots'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Your Time Slots</h4>
        {Object.keys(slotsByDate).length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No time slots created yet</p>
            <p className="text-sm text-gray-400">Create your first time slots to start accepting appointments</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <div key={date} className="border border-gray-200 rounded-xl p-4">
                <h5 className="font-medium text-gray-900 mb-3">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <div key={slot._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="text-xs text-gray-500">
                          {slot.isBooked ? 'Booked' : slot.isAvailable ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {slot.isBooked ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <button
                            onClick={() => toggleSlotAvailability(slot._id, slot.isAvailable)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {slot.isAvailable ? (
                              <Clock className="w-5 h-5 text-blue-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeSlotManager
