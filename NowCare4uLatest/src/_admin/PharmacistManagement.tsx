import { useState, useEffect } from 'react';
import { useAdminAuth } from './AdminContext';
import {
  User,
  Mail,
  Phone,
  FileText,
  Receipt,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  AlertCircle
} from 'lucide-react';

interface Pharmacist {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  gstNumber: string;
  isApproved: boolean;
  isVerified: boolean;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export default function PharmacistManagement() {
  const { token } = useAdminAuth();
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPharmacists();
  }, [token]);

  const loadPharmacists = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/admin/pharmacists', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setPharmacists(data.pharmacists);
      }
    } catch (error) {
      console.error('Failed to load pharmacists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (pharmacistId: string, isApproved: boolean, rejectionReason?: string) => {
    try {
      setActionLoading(pharmacistId);
      const response = await fetch(`https://nowcare4-u-production-acbz.vercel.app/api/admin/pharmacists/${pharmacistId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved, rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        setPharmacists(pharmacists.map(p =>
          p._id === pharmacistId ? { ...p, isApproved, rejectionReason } : p
        ));
        alert(`Pharmacist ${isApproved ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to update pharmacist status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerification = async (pharmacistId: string, isVerified: boolean, rejectionReason?: string) => {
    try {
      setActionLoading(pharmacistId);
      const response = await fetch(`https://nowcare4-u-production-acbz.vercel.app/api/admin/pharmacists/${pharmacistId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified, rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        setPharmacists(pharmacists.map(p =>
          p._id === pharmacistId ? { ...p, isVerified, rejectionReason } : p
        ));
        alert(`Pharmacist ${isVerified ? 'verified' : 'verification rejected'} successfully!`);
      } else {
        alert('Failed to update verification: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to update pharmacist verification:', error);
      alert('Failed to update verification. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (pharmacistId: string, type: 'approval' | 'verification') => {
    const reason = prompt(`Enter rejection reason for ${type}:`);
    if (reason) {
      if (type === 'approval') {
        handleApproval(pharmacistId, false, reason);
      } else {
        handleVerification(pharmacistId, false, reason);
      }
    }
  };

  const filteredPharmacists = pharmacists.filter(pharmacist =>
    pharmacist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacist.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacist.gstNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (pharmacist: Pharmacist) => {
    if (pharmacist.rejectionReason) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    }

    if (pharmacist.isVerified && pharmacist.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified & Approved
        </span>
      );
    }

    if (pharmacist.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading pharmacists...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacist Management</h1>
          <p className="text-gray-600">Manage pharmacist registrations and approvals ({pharmacists.length} total)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, license number, or GST number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pharmacist Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pharmacist Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License & GST
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPharmacists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No pharmacists found matching your search.' : 'No pharmacists registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredPharmacists.map((pharmacist) => (
                  <tr key={pharmacist._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pharmacist.name}</div>
                          <div className="text-sm text-gray-500">ID: {pharmacist._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          {pharmacist.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {pharmacist.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          {pharmacist.licenseNumber}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Receipt className="w-4 h-4 text-gray-400 mr-2" />
                          {pharmacist.gstNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getStatusBadge(pharmacist)}
                        {pharmacist.rejectionReason && (
                          <div className="flex items-start text-xs text-red-600">
                            <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{pharmacist.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(pharmacist.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {!pharmacist.isApproved && !pharmacist.rejectionReason && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(pharmacist._id, true)}
                              disabled={actionLoading === pharmacist._id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(pharmacist._id, 'approval')}
                              disabled={actionLoading === pharmacist._id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}

                        {pharmacist.isApproved && !pharmacist.isVerified && !pharmacist.rejectionReason && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerification(pharmacist._id, true)}
                              disabled={actionLoading === pharmacist._id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verify
                            </button>
                            <button
                              onClick={() => handleReject(pharmacist._id, 'verification')}
                              disabled={actionLoading === pharmacist._id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}

                        {(pharmacist.isVerified || pharmacist.rejectionReason) && (
                          <span className="text-xs text-gray-500">
                            {pharmacist.isVerified ? 'Fully processed' : 'Action completed'}
                          </span>
                        )}

                        {actionLoading === pharmacist._id && (
                          <span className="text-xs text-blue-600">Processing...</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
