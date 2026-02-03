"use client"

import { useState, useEffect } from "react"
import { LogOut, User, BarChart3, CheckCircle, AlertCircle, Building2, Package, FileText } from "lucide-react"
import { usePharmacistStore } from "../store/pharmacistStore"
import PharmacistProfile from "./PharmacistProfile"
import ProductManagement from "./ProductManagement"
import InvoiceList from "./InvoiceList"
import CreateInvoice from "./CreateInvoice"

const PharmacistDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview')
    const [invoiceView, setInvoiceView] = useState<'list' | 'create'>('list')
    const { pharmacist, logout, checkAuth } = usePharmacistStore()

    useEffect(() => {
        checkAuth()
    }, [])

    const handleLogout = () => {
        logout()
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'profile', label: 'Profile', icon: User },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab pharmacist={pharmacist} />
            case 'products':
                return <ProductManagement onNavigateToInvoices={() => setActiveTab('invoices')} />
            case 'invoices':
                return invoiceView === 'list'
                    ? <InvoiceList onCreate={() => setInvoiceView('create')} />
                    : <CreateInvoice onSuccess={() => setInvoiceView('list')} />
            case 'profile':
                return <PharmacistProfile />
            default:
                return <OverviewTab pharmacist={pharmacist} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-8 h-8 text-green-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Pharmacist Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{pharmacist?.name}</p>
                                <p className="text-xs text-gray-500">Lic: {pharmacist?.licenseNumber}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <nav className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-green-50 text-green-700 border-r-4 border-green-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Overview Tab Component
const OverviewTab = ({ pharmacist }: { pharmacist: any }) => {

    const stats = [
        {
            title: 'Profile Status',
            value: pharmacist?.profileCompleted ? 'Complete' : 'Incomplete',
            color: pharmacist?.profileCompleted ? 'bg-green-500' : 'bg-yellow-500',
            icon: User
        },
        {
            title: 'Verification',
            value: pharmacist?.isVerified ? 'Verified' : 'Pending',
            color: pharmacist?.isVerified ? 'bg-blue-500' : 'bg-orange-500',
            icon: CheckCircle
        },
        {
            title: 'Account Approval',
            value: pharmacist?.isApproved ? 'Approved' : 'Pending',
            color: pharmacist?.isApproved ? 'bg-teal-500' : 'bg-red-500',
            icon: Building2
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {pharmacist?.name}!</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className={`${stat.color} p-3 rounded-xl`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Status Alerts */}
                <div className="space-y-4">
                    {!pharmacist?.isVerified && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-orange-800">Verification Pending</h3>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Your account is currently under verification. Some features may be restricted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {!pharmacist?.isApproved && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Approval Pending</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        Your account is awaiting admin approval. You will be notified once approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default PharmacistDashboard
