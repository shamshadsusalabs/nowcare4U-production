"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, FileText, Upload, Building2 } from "lucide-react"
import { usePharmacistStore } from "../store/pharmacistStore"

const PharmacistAuth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    // Using 'any' for files initially to simplify type checking in state, or specifically File | null
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        licenseNumber: '',
        gstNumber: '',
        aadharNumber: '',
        panNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    })

    // Separate state for files
    const [files, setFiles] = useState<{
        aadharFile: File | null;
        panFile: File | null;
        labLicenseFile: File | null;
        gstFile: File | null;
    }>({
        aadharFile: null,
        panFile: null,
        labLicenseFile: null,
        gstFile: null
    })

    const { login, register, loading, error } = usePharmacistStore()

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

        if (isLogin) {
            await login(formData.email, formData.password)
        } else {
            const submissionData = new FormData()
            // Append text fields
            Object.entries(formData).forEach(([key, value]) => {
                submissionData.append(key, value)
            })
            // Append files
            if (files.aadharFile) submissionData.append('aadharFile', files.aadharFile)
            if (files.panFile) submissionData.append('panFile', files.panFile)
            if (files.labLicenseFile) submissionData.append('labLicenseFile', files.labLicenseFile)
            if (files.gstFile) submissionData.append('gstFile', files.gstFile)

            await register(submissionData)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl"> {/* Increased width for reg form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isLogin ? 'Pharmacist Login' : 'Pharmacist Registration'}
                        </h2>
                        <p className="text-green-100">
                            {isLogin ? 'Access your pharmacy dashboard' : 'Join our medical network'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                                                placeholder="+91 9876543210"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                                                placeholder="License No."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="gstNumber"
                                                value={formData.gstNumber}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                                                placeholder="GST No."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* File Uploads - Simplified for UI */}
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* License File */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'labLicenseFile')} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,image/*" />
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 block">{files.labLicenseFile ? files.labLicenseFile.name : 'Upload License'}</span>
                                        </div>

                                        {/* GST File */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'gstFile')} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,image/*" />
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 block">{files.gstFile ? files.gstFile.name : 'Upload GST Cert'}</span>
                                        </div>

                                        {/* Aadhar File */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'aadharFile')} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,image/*" />
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 block">{files.aadharFile ? files.aadharFile.name : 'Upload Aadhar'}</span>
                                        </div>

                                        {/* PAN File */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'panFile')} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,image/*" />
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 block">{files.panFile ? files.panFile.name : 'Upload PAN'}</span>
                                        </div>
                                    </div>

                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                                        placeholder="pharmacist@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                                    </div>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 text-green-600 hover:text-green-700 font-semibold transition-colors duration-300"
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PharmacistAuth
