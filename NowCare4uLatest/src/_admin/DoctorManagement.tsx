import { useState, useEffect } from 'react';
import { useAdminAuth } from './AdminContext';
import { 
  Search, 
  Filter, 
  X, 
  Eye, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  FileText,
  DollarSign,
  Languages,
  Star,
  Shield,
  ShieldCheck
} from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  speciality: string;
  experience: string;
  qualification: string;
  location: string;
  consultationFee: string;
  licenseNumber: string;
  languages: string[];
  image: string;
  profileCompleted: boolean;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  isApproved?: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export default function DoctorManagement() {
  const { token } = useAdminAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifyingDoctorId, setVerifyingDoctorId] = useState<string | null>(null);

  useEffect(() => {
    loadDoctors();
  }, [token]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, statusFilter]);

  const loadDoctors = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDoctors(data.doctors || data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => {
        if (statusFilter === 'approved') return doctor.isVerified;
        if (statusFilter === 'pending') return !doctor.isVerified;
        if (statusFilter === 'rejected') return doctor.rejectionReason;
        return true;
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleApprove = async (doctorId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified: true }),
      });

      if (response.ok) {
        await loadDoctors();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Failed to verify doctor:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVerification = async (doctorId: string, currentStatus: boolean) => {
    setVerifyingDoctorId(doctorId);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });

      if (response.ok) {
        await loadDoctors();
      }
    } catch (error) {
      console.error('Failed to toggle verification:', error);
    } finally {
      setVerifyingDoctorId(null);
    }
  };

  const handleReject = async (doctorId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          isVerified: false, 
          rejectionReason: rejectionReason.trim() 
        }),
      });

      if (response.ok) {
        await loadDoctors();
        setShowModal(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject doctor:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (doctor: Doctor) => {
    if (doctor.isVerified) {
      return (
        <button
          onClick={() => handleToggleVerification(doctor._id, doctor.isVerified)}
          disabled={verifyingDoctorId === doctor._id}
          className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-xs font-medium flex items-center transition-colors cursor-pointer disabled:opacity-50"
        >
          {verifyingDoctorId === doctor._id ? (
            <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin mr-1" />
          ) : (
            <ShieldCheck className="w-3 h-3 mr-1" />
          )}
          {verifyingDoctorId === doctor._id ? 'Updating...' : 'Verified'}
        </button>
      );
    } else if (doctor.rejectionReason) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
          <X className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    } else {
      return (
        <button
          onClick={() => handleToggleVerification(doctor._id, doctor.isVerified)}
          disabled={verifyingDoctorId === doctor._id}
          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-full text-xs font-medium flex items-center transition-colors cursor-pointer disabled:opacity-50"
        >
          {verifyingDoctorId === doctor._id ? (
            <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin mr-1" />
          ) : (
            <Shield className="w-3 h-3 mr-1" />
          )}
          {verifyingDoctorId === doctor._id ? 'Updating...' : 'Not Verified'}
        </button>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
        <p className="text-gray-600">Review and manage doctor applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Not Verified</option>
              <option value="approved">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Doctors ({filteredDoctors.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No doctors found matching your criteria
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {doctor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          {doctor.speciality}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {doctor.experience} exp
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {doctor.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          ID: {doctor._id}
                        </span>
                        <span className="flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          License: {doctor.licenseNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(doctor)}
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowModal(true);
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Doctor Detail Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Doctor Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">
                      {selectedDoctor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedDoctor.name}</h4>
                    <p className="text-gray-600">{selectedDoctor.speciality}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusBadge(selectedDoctor)}
                      {selectedDoctor.profileCompleted && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          Profile Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Doctor ID & Basic Info
                  </h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>ID:</strong> {selectedDoctor._id}</div>
                    <div><strong>License Number:</strong> {selectedDoctor.licenseNumber}</div>
                    <div><strong>Profile Status:</strong> {selectedDoctor.profileCompleted ? 'Complete' : 'Incomplete'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">Contact Information</h5>
                    <div className="space-y-3">
                      <div className="flex items-start text-sm">
                        <Mail className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <div className="font-medium">{selectedDoctor.email}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <Phone className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <div className="font-medium">{selectedDoctor.phone || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <div className="font-medium">{selectedDoctor.location || 'Not provided'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">Professional Details</h5>
                    <div className="space-y-3">
                      <div className="flex items-start text-sm">
                        <Award className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Experience:</span>
                          <div className="font-medium">{selectedDoctor.experience}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Consultation Fee:</span>
                          <div className="font-medium">₹{selectedDoctor.consultationFee}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <Star className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Rating:</span>
                          <div className="font-medium">{selectedDoctor.rating}/5 ({selectedDoctor.totalReviews} reviews)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Languages className="w-4 h-4 mr-2" />
                      Languages
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.languages?.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {lang}
                        </span>
                      )) || <span className="text-gray-500 text-sm">Not specified</span>}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Timestamps
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Created:</strong> {new Date(selectedDoctor.createdAt).toLocaleString()}</div>
                      <div><strong>Updated:</strong> {new Date(selectedDoctor.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {selectedDoctor.qualification && (
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Qualification
                    </h5>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 font-medium">{selectedDoctor.qualification}</p>
                    </div>
                  </div>
                )}

                {selectedDoctor.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-medium text-red-900 mb-2">Rejection Reason</h5>
                    <p className="text-red-700">{selectedDoctor.rejectionReason}</p>
                  </div>
                )}

                {!selectedDoctor.isVerified && !selectedDoctor.rejectionReason && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (optional)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter reason for rejection..."
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(selectedDoctor._id)}
                        disabled={actionLoading}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        {actionLoading ? 'Processing...' : 'Verify Doctor'}
                      </button>
                      <button
                        onClick={() => handleReject(selectedDoctor._id)}
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
