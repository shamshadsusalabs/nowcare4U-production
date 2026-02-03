import { useState } from 'react';
import { X, User, Mail, Phone, FileText, Receipt, CreditCard, CheckCircle } from 'lucide-react';
import type { PharmacistFormData } from '../types/pharmacist.types';
import { validatePharmacistForm, validateFileSize } from '../utils/pharmacist.utils';
import { pharmacistService } from '../service/pharmacist.service';
import { usePharmacistStore } from '../store/pharmacist.store';
import { useAdminAuth } from '../AdminContext';

interface AddPharmacistModalProps {
    onClose: () => void;
}

const initialFormData: PharmacistFormData = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    licenseNumber: '',
    gstNumber: '',
    aadharNumber: '',
    panNumber: '',
    aadharFile: null,
    panFile: null,
    licenseFile: null,
    gstFile: null
};

export default function AddPharmacistModal({ onClose }: AddPharmacistModalProps) {
    const { token } = useAdminAuth();
    const { addPharmacist } = usePharmacistStore();
    const [formData, setFormData] = useState<PharmacistFormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof PharmacistFormData) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!validateFileSize(file, 2)) {
                setFormErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 2MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, [fieldName]: file }));
            setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validatePharmacistForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        if (!token) {
            alert('Authentication required');
            return;
        }

        try {
            setIsSubmitting(true);
            const newPharmacist = await pharmacistService.createPharmacist(token, formData);
            addPharmacist(newPharmacist);
            alert('Pharmacist added successfully!');
            onClose();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add pharmacist');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add New Pharmacist</h2>
                        <p className="text-sm text-gray-500 mt-1">Create a new verified pharmacist account</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Personal Information */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Full name"
                                />
                            </div>
                            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Email address"
                                />
                            </div>
                            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                />
                            </div>
                            {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Min 6 characters"
                                    minLength={6}
                                />
                            </div>
                            {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                        </div>
                    </div>

                    {/* Business Information */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Business Information</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.licenseNumber}
                                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.licenseNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="License number"
                                />
                            </div>
                            {formErrors.licenseNumber && <p className="text-red-500 text-xs mt-1">{formErrors.licenseNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
                            <div className="relative">
                                <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.gstNumber}
                                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.gstNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="22AAAAA0000A1Z5"
                                    maxLength={15}
                                />
                            </div>
                            {formErrors.gstNumber && <p className="text-red-500 text-xs mt-1">{formErrors.gstNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.aadharNumber}
                                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.aadharNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="12-digit Aadhar"
                                    maxLength={12}
                                />
                            </div>
                            {formErrors.aadharNumber && <p className="text-red-500 text-xs mt-1">{formErrors.aadharNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.panNumber}
                                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.panNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="ABCDE1234F"
                                    maxLength={10}
                                />
                            </div>
                            {formErrors.panNumber && <p className="text-red-500 text-xs mt-1">{formErrors.panNumber}</p>}
                        </div>
                    </div>

                    {/* Documents */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload Documents (Max 2MB each, Optional)</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {(['aadharFile', 'panFile', 'licenseFile', 'gstFile'] as const).map((fieldName) => (
                            <div key={fieldName}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {fieldName.replace('File', '').charAt(0).toUpperCase() + fieldName.replace('File', '').slice(1)} Document
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => handleFileChange(e, fieldName)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData[fieldName] && <p className="text-xs text-green-600 mt-1">✓ {formData[fieldName]?.name}</p>}
                                {formErrors[fieldName] && <p className="text-red-500 text-xs mt-1">{formErrors[fieldName]}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-800">Auto-Verified Account</h4>
                                <p className="text-sm text-blue-600 mt-1">
                                    Pharmacists added by admin are automatically approved and verified.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Pharmacist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
