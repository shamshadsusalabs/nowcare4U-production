"use client"

import { useState, useEffect } from "react"
import { useLabStore } from "../store/labStore"
import { labService } from "../service/lab.service"
import { Plus, Search, Edit2, Trash2, X, FlaskConical, MapPin, IndianRupee } from "lucide-react"
import type { LabTest } from "../types"

const LabServices = () => {
    const { token, lab } = useLabStore()
    const [services, setServices] = useState<LabTest[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingService, setEditingService] = useState<LabTest | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        testName: '',
        category: 'Pathology',
        description: '',
        price: '',
        discountedPrice: '',
        sampleType: '',
        reportTurnaroundTime: '',
        preTestRequirements: '', // Comma separated
        isHomeCollectionAvailable: false,
        homeCollectionCharges: 0,
        // Location - Default to lab address if available
        address: lab?.address || '',
        city: lab?.city || '',
        pincode: lab?.pincode || '',
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            if (token) {
                const response = await labService.getMyServices(token)
                if (response.success) {
                    setServices(response.data)
                }
            }
        } catch (error) {
            console.error('Failed to fetch services', error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            testName: '',
            category: 'Pathology',
            description: '',
            price: '',
            discountedPrice: '',
            sampleType: '',
            reportTurnaroundTime: '',
            preTestRequirements: '',
            isHomeCollectionAvailable: false,
            homeCollectionCharges: 0,
            address: lab?.address || '',
            city: lab?.city || '',
            pincode: lab?.pincode || '',
        })
        setEditingService(null)
    }

    const handleOpenModal = (service?: LabTest) => {
        if (service) {
            setEditingService(service)
            setFormData({
                testName: service.testName,
                category: service.category,
                description: service.description,
                price: service.price.toString(),
                discountedPrice: service.discountedPrice?.toString() || '',
                sampleType: service.sampleType || '',
                reportTurnaroundTime: service.reportTurnaroundTime || '',
                preTestRequirements: service.preTestRequirements?.join(', ') || '',
                isHomeCollectionAvailable: service.isHomeCollectionAvailable,
                homeCollectionCharges: service.homeCollectionCharges || 0,
                address: service.location.address,
                city: service.location.city,
                pincode: service.location.pincode,
            })
        } else {
            resetForm()
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        const payload = {
            testName: formData.testName,
            category: formData.category,
            description: formData.description,
            price: Number(formData.price),
            discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
            sampleType: formData.sampleType,
            reportTurnaroundTime: formData.reportTurnaroundTime,
            preTestRequirements: formData.preTestRequirements.split(',').map(s => s.trim()).filter(Boolean),
            isHomeCollectionAvailable: formData.isHomeCollectionAvailable,
            homeCollectionCharges: Number(formData.homeCollectionCharges),
            location: {
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode
            }
        }

        try {
            if (editingService) {
                await labService.updateService(token, editingService._id, payload)
            } else {
                await labService.createService(token, payload)
            }
            fetchServices()
            setIsModalOpen(false)
            resetForm()
        } catch (error) {
            console.error('Operation failed', error)
            alert('Failed to save service')
        }
    }

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Are you sure you want to delete this service?')) return
        try {
            await labService.deleteService(token, id)
            fetchServices()
        } catch (error) {
            console.error('Delete failed', error)
        }
    }

    const filteredServices = services.filter(service =>
        service.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Lab Services</h2>
                    <p className="text-gray-500">Manage your test offerings</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add New Service
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by test name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>

            {/* Services List */}
            {loading ? (
                <div className="text-center py-10">Loading services...</div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <FlaskConical className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">No services found. Add your first test!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2">
                                        {service.category}
                                    </span>
                                    <h3 className="font-bold text-lg text-gray-800">{service.testName}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(service)} className="text-gray-400 hover:text-blue-600">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(service._id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                            <div className="space-y-2 text-sm text-gray-500 mb-4">
                                {service.reportTurnaroundTime && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        Report in: {service.reportTurnaroundTime}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} /> {service.location.city}
                                </div>
                            </div>

                            <div className="flex items-end justify-between border-t pt-4">
                                <div>
                                    {service.discountedPrice ? (
                                        <>
                                            <span className="text-xs text-gray-400 line-through">₹{service.price}</span>
                                            <div className="font-bold text-lg text-green-600 flex items-center">
                                                <IndianRupee size={16} />{service.discountedPrice}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="font-bold text-lg text-gray-800 flex items-center">
                                            <IndianRupee size={16} />{service.price}
                                        </div>
                                    )}
                                </div>
                                {service.isHomeCollectionAvailable && (
                                    <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">
                                        Home Collection
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.testName}
                                        onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="e.g. Complete Blood Count (CBC)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option>Pathology</option>
                                        <option>Radiology</option>
                                        <option>Cardiology</option>
                                        <option>Microbiology</option>
                                        <option>Biochemistry</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sample Type</label>
                                    <input
                                        type="text"
                                        value={formData.sampleType}
                                        onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="e.g. Blood, Urine"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="Brief details about the test..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price (Optional)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.discountedPrice}
                                        onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Turnaround Time</label>
                                    <input
                                        type="text"
                                        value={formData.reportTurnaroundTime}
                                        onChange={(e) => setFormData({ ...formData, reportTurnaroundTime: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="e.g. 24 Hours"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pre-test Requirements</label>
                                    <input
                                        type="text"
                                        value={formData.preTestRequirements}
                                        onChange={(e) => setFormData({ ...formData, preTestRequirements: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="e.g. Fasting 12 hrs, Water only"
                                    />
                                </div>

                                {/* Location Section */}
                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <MapPin size={16} /> Location Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                placeholder="Address"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            placeholder="City"
                                        />
                                        <input
                                            type="text"
                                            required
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            placeholder="Pincode"
                                        />
                                    </div>
                                </div>

                                {/* Home Collection Checkbox */}
                                <div className="md:col-span-2 flex items-center gap-4 p-4 border rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="homeCollection"
                                        checked={formData.isHomeCollectionAvailable}
                                        onChange={(e) => setFormData({ ...formData, isHomeCollectionAvailable: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="homeCollection" className="font-medium text-gray-700 cursor-pointer select-none">
                                        Home Collection Available
                                    </label>

                                    {formData.isHomeCollectionAvailable && (
                                        <div className="flex-1 ml-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.homeCollectionCharges}
                                                onChange={(e) => setFormData({ ...formData, homeCollectionCharges: Number(e.target.value) })}
                                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                placeholder="Collection Charge (₹)"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                >
                                    {editingService ? 'Update Service' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LabServices
