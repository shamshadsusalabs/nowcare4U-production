import { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from './AdminContext';
import { Search, Filter, Plus } from 'lucide-react';
import { useDoctorStore } from './store/doctor.store';
import { doctorService } from './service/doctor.service';
import { filterDoctors } from './utils/doctor.utils';
import type { Doctor } from './types/doctor.types';
import DoctorTable from './doctor/DoctorTable';
import DoctorDetailsModal from './doctor/DoctorDetailsModal';
import AddDoctorModal from './doctor/AddDoctorModal';

export default function DoctorManagement() {
  const { token } = useAdminAuth();
  const { doctors, loading, fetchDoctors, updateDoctor } = useDoctorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [verifyingDoctorId, setVerifyingDoctorId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchDoctors(token);
    }
  }, [token, fetchDoctors]);

  // Filtered doctors using memoized utility function
  const filteredDoctors = useMemo(
    () => filterDoctors(doctors, searchTerm, statusFilter),
    [doctors, searchTerm, statusFilter]
  );

  const handleToggleVerification = async (doctorId: string, currentStatus: boolean) => {
    if (!token) return;

    setVerifyingDoctorId(doctorId);
    try {
      await doctorService.updateVerificationStatus(token, doctorId, !currentStatus);
      updateDoctor(doctorId, { isVerified: !currentStatus });
    } catch (error) {
      console.error('Failed to toggle verification:', error);
      alert(error instanceof Error ? error.message : 'Failed to update verification status');
    } finally {
      setVerifyingDoctorId(null);
    }
  };

  const handleApprove = async (doctorId: string) => {
    if (!token) return;

    setActionLoading(true);
    try {
      await doctorService.updateVerificationStatus(token, doctorId, true);
      updateDoctor(doctorId, { isVerified: true, rejectionReason: undefined });
      setShowModal(false);
      alert('Doctor verified successfully!');
    } catch (error) {
      console.error('Failed to verify doctor:', error);
      alert(error instanceof Error ? error.message : 'Failed to verify doctor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doctorId: string, reason: string) => {
    if (!token) return;

    setActionLoading(true);
    try {
      await doctorService.updateVerificationStatus(token, doctorId, false, reason);
      updateDoctor(doctorId, { isVerified: false, rejectionReason: reason });
      setShowModal(false);
      alert('Doctor rejected successfully!');
    } catch (error) {
      console.error('Failed to reject doctor:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject doctor');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">
            Review and manage doctor applications ({doctors.length} total)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Doctor
        </button>
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

      {/* Doctors Table */}
      <DoctorTable
        doctors={filteredDoctors}
        onViewDetails={(doctor) => {
          setSelectedDoctor(doctor);
          setShowModal(true);
        }}
        onToggleVerification={handleToggleVerification}
        verifyingDoctorId={verifyingDoctorId}
      />

      {/* Modals */}
      {showAddModal && (
        <AddDoctorModal
          onClose={() => {
            setShowAddModal(false);
            if (token) fetchDoctors(token); // Refresh list
          }}
        />
      )}

      {showModal && selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={() => setShowModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}
