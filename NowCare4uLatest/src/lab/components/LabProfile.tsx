"use client"

import { useState, useEffect } from "react"
import { Phone, FileText, CheckCircle, XCircle, CreditCard, Upload, MapPin, Building2, FlaskConical } from "lucide-react"
import { useLabStore } from "../store/labStore"

const LabProfile = () => {
    const { lab, loading, updateProfile } = useLabStore()

    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        labLicenseNumber: '',
        gstNumber: '',
        aadharNumber: '',
        panNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    })

    const [files, setFiles] = useState<{
        labLicenseFile: File | null;
        gstFile: File | null;
        aadharFile: File | null;
        panFile: File | null;
    }>({
        labLicenseFile: null,
        gstFile: null,
        aadharFile: null,
        panFile: null
    })

    useEffect(() => {
        if (lab) {
            setFormData({
                name: lab.name || '',
                phoneNumber: lab.phoneNumber || '',
                labLicenseNumber: lab.labLicenseNumber || '',
                gstNumber: lab.gstNumber || '',
                aadharNumber: lab.aadharNumber || '',
                panNumber: lab.panNumber || '',
                address: lab.address || '',
                city: lab.city || '',
                state: lab.state || '',
                pincode: lab.pincode || '',
            })
        }
    }, [lab])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({
                ...prev,
                [fieldName]: e.target.files![0]
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const submissionData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            submissionData.append(key, value)
        })

        if (files.labLicenseFile) submissionData.append('labLicenseFile', files.labLicenseFile)
        if (files.gstFile) submissionData.append('gstFile', files.gstFile)
        if (files.aadharFile) submissionData.append('aadharFile', files.aadharFile)
        if (files.panFile) submissionData.append('panFile', files.panFile)

        const success = await updateProfile(submissionData)

        if (success) {
            setNotification({
                type: 'success',
                message: 'Lab profile updated successfully!'
            })
            setFiles({ labLicenseFile: null, gstFile: null, aadharFile: null, panFile: null })
        } else {
            setNotification({
                type: 'error',
                message: 'Failed to update profile.'
            })
        }
        setTimeout(() => setNotification(null), 3000)
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <FlaskConical className="w-6 h-6 mr-3" />
                        Lab Profile
                    </h2>
                    <p className="text-blue-100 mt-2">Manage your diagnostic center details</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {notification && (
                        <div className={`p-4 rounded-xl border-2 flex items-center space-x-3 ${notification.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            {notification.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="font-medium">{notification.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lab Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                    placeholder="Full Address"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="labLicenseNumber"
                                    value={formData.labLicenseNumber}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:outline-none cursor-not-allowed text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:outline-none cursor-not-allowed text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="aadharNumber"
                                    value={formData.aadharNumber}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:outline-none cursor-not-allowed text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:outline-none cursor-not-allowed text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Uploaded Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {lab?.labLicenseFile && (
                                <div className="p-4 border rounded-xl bg-gray-50 flex flex-col items-center text-center">
                                    <FileText className="w-8 h-8 text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 mb-2">Lab License</span>
                                    <a
                                        href={lab.labLicenseFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                    >
                                        View Document
                                    </a>
                                    <div className="mt-3 w-full">
                                        <label className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                            <Upload className="mr-2 h-3 w-3" />
                                            {files.labLicenseFile ? 'Selected' : 'Update'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'labLicenseFile')} accept=".pdf,image/*" />
                                        </label>
                                        {files.labLicenseFile && <span className="text-xs text-green-600 block mt-1 truncate">{files.labLicenseFile.name}</span>}
                                    </div>
                                </div>
                            )}
                            {lab?.gstFile && (
                                <div className="p-4 border rounded-xl bg-gray-50 flex flex-col items-center text-center">
                                    <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 mb-2">GST Certificate</span>
                                    <a
                                        href={lab.gstFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                    >
                                        View Document
                                    </a>
                                    <div className="mt-3 w-full">
                                        <label className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                            <Upload className="mr-2 h-3 w-3" />
                                            {files.gstFile ? 'Selected' : 'Update'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'gstFile')} accept=".pdf,image/*" />
                                        </label>
                                        {files.gstFile && <span className="text-xs text-green-600 block mt-1 truncate">{files.gstFile.name}</span>}
                                    </div>
                                </div>
                            )}
                            {lab?.aadharFile && (
                                <div className="p-4 border rounded-xl bg-gray-50 flex flex-col items-center text-center">
                                    <FileText className="w-8 h-8 text-green-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 mb-2">Aadhar Card</span>
                                    <a
                                        href={lab.aadharFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                    >
                                        View Document
                                    </a>
                                    <div className="mt-3 w-full">
                                        <label className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                            <Upload className="mr-2 h-3 w-3" />
                                            {files.aadharFile ? 'Selected' : 'Update'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'aadharFile')} accept=".pdf,image/*" />
                                        </label>
                                        {files.aadharFile && <span className="text-xs text-green-600 block mt-1 truncate">{files.aadharFile.name}</span>}
                                    </div>
                                </div>
                            )}
                            {lab?.panFile && (
                                <div className="p-4 border rounded-xl bg-gray-50 flex flex-col items-center text-center">
                                    <FileText className="w-8 h-8 text-orange-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 mb-2">PAN Card</span>
                                    <a
                                        href={lab.panFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                    >
                                        View Document
                                    </a>
                                    <div className="mt-3 w-full">
                                        <label className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                            <Upload className="mr-2 h-3 w-3" />
                                            {files.panFile ? 'Selected' : 'Update'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'panFile')} accept=".pdf,image/*" />
                                        </label>
                                        {files.panFile && <span className="text-xs text-green-600 block mt-1 truncate">{files.panFile.name}</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                        {(!lab?.labLicenseFile && !lab?.gstFile && !lab?.aadharFile && !lab?.panFile) && (
                            <p className="text-sm text-gray-500 italic">No documents available to view.</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LabProfile
