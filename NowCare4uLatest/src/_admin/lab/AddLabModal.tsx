import { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { useAdminAuth } from '../AdminContext';
import { labService } from '../service/lab.service';
import { useLabStore } from '../store/lab.store';
import type { LabFormData } from '../types/lab.types';

interface AddLabModalProps {
    onClose: () => void;
}

export default function AddLabModal({ onClose }: AddLabModalProps) {
    const { token } = useAdminAuth();
    const { addLab } = useLabStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<LabFormData>({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        labLicenseNumber: '',
        gstNumber: '',
        aadharNumber: '',
        panNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        aadharFile: null,
        panFile: null,
        labLicenseFile: null,
        gstFile: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof LabFormData) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: e.target.files![0]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const newLab = await labService.createLab(token, formData);
            addLab(newLab);
            alert('Lab added successfully!');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add lab');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Add New Lab</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Basic & Location Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 border-b pb-2">Location Details</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Security (Password) */}
                        <div>
                            <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Security</h4>
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* 3. Legal & Documents */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 border-b pb-2">Legal & Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab License Number *</label>
                                    <input
                                        type="text"
                                        name="labLicenseNumber"
                                        required
                                        value={formData.labLicenseNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        required
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                                    <input
                                        type="text"
                                        name="aadharNumber"
                                        value={formData.aadharNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                    <input
                                        type="text"
                                        name="panNumber"
                                        value={formData.panNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-600">Upload Lab License</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'labLicenseFile')}
                                            accept="image/*,.pdf"
                                        />
                                        {formData.labLicenseFile && (
                                            <span className="mt-2 text-xs text-green-600 flex items-center">
                                                <Check className="w-3 h-3 mr-1" />
                                                {formData.labLicenseFile.name}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-600">Upload GST Certificate</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'gstFile')}
                                            accept="image/*,.pdf"
                                        />
                                        {formData.gstFile && (
                                            <span className="mt-2 text-xs text-green-600 flex items-center">
                                                <Check className="w-3 h-3 mr-1" />
                                                {formData.gstFile.name}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-600">Upload Aadhar Card</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'aadharFile')}
                                            accept="image/*,.pdf"
                                        />
                                        {formData.aadharFile && (
                                            <span className="mt-2 text-xs text-green-600 flex items-center">
                                                <Check className="w-3 h-3 mr-1" />
                                                {formData.aadharFile.name}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-600">Upload PAN Card</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'panFile')}
                                            accept="image/*,.pdf"
                                        />
                                        {formData.panFile && (
                                            <span className="mt-2 text-xs text-green-600 flex items-center">
                                                <Check className="w-3 h-3 mr-1" />
                                                {formData.panFile.name}
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Labs added by admin are automatically verified and approved.
                            </p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add Lab'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
