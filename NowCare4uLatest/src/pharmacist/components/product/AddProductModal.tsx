import { useState, useEffect } from 'react';
import { X, Upload, Minus, Package, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { useProductStore } from '../../store/productStore';

import type { Product } from '../../types/product.types';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editProduct?: Product | null;
}

const AddProductModal = ({ isOpen, onClose, editProduct }: AddProductModalProps) => {
    const { addProduct, updateProduct, loading } = useProductStore();

    // Initial State
    const initialFormState = {
        name: '',
        composition: '',
        brand: '',
        manufacturer: '',
        category: 'Tablet',
        description: '',
        stock: '',
        unit: 'Strip',
        packingDetails: '10 Tablets/Strip',
        expiryDate: '',
        manufacturingDate: '',
        mrp: '',
        price: '',
        discount: '',
        deliveryTime: '24 hours',
        minimumOrderQuantity: '1',
        isPrescriptionRequired: false,
        address: '',
        city: '',
        pincode: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [useCustomLocation, setUseCustomLocation] = useState(false);

    const safeDate = (dateStr?: string) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (editProduct) {
                // Populate form for editing
                setFormData({
                    name: editProduct.name,
                    composition: editProduct.composition || '',
                    brand: editProduct.brand || '',
                    manufacturer: editProduct.manufacturer || '',
                    category: editProduct.category || 'Tablet',
                    description: editProduct.description || '',
                    stock: String(editProduct.stock),
                    unit: editProduct.unit || 'Strip',
                    packingDetails: editProduct.packingDetails || '',
                    expiryDate: safeDate(editProduct.expiryDate),
                    manufacturingDate: safeDate(editProduct.manufacturingDate),
                    mrp: String(editProduct.mrp),
                    price: String(editProduct.price),
                    discount: String(editProduct.discount || ''),
                    deliveryTime: editProduct.deliveryTime || '',
                    minimumOrderQuantity: String(editProduct.minimumOrderQuantity || 1),
                    isPrescriptionRequired: editProduct.isPrescriptionRequired,
                    address: editProduct.location?.address || '',
                    city: editProduct.location?.city || '',
                    pincode: editProduct.location?.pincode || '',
                });
                setPreviews(editProduct.images || []);
                setUseCustomLocation(!!editProduct.location);
            } else {
                // Reset for new product
                setFormData(initialFormState);
                setImages([]);
                setPreviews([]);
                setUseCustomLocation(false);
            }
        }
    }, [isOpen, editProduct]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submissionData = new FormData();

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                submissionData.append(key, String(value));
            }
        });

        // Append images
        images.forEach(image => {
            submissionData.append('images', image);
        });

        let success = false;
        if (editProduct) {
            success = await updateProduct(editProduct._id, submissionData);
        } else {
            success = await addProduct(submissionData);
        }

        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10">
                    <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Package className="w-6 h-6" />
                                {editProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button type="button" onClick={onClose} className="text-green-100 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Basic Info */}
                            <section>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Product Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder="e.g. Dolo 650" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Composition (Salt)</label>
                                        <input name="composition" value={formData.composition} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder="e.g. Paracetamol 650mg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all">
                                            {['Tablet', 'Syrup', 'Injection', 'Capsule', 'Cream', 'Gel', 'Drops', 'Powder', 'Equipment', 'Other'].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* Inventory & Pricing */}
                            <section>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                    <IndianRupee className="w-5 h-5" /> Inventory & Pricing
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                        <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder="e.g. 100" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                                        <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all">
                                            {['Strip', 'Bottle', 'Box', 'Tube', 'Vial', 'Piece', 'Pack'].map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Packing Details</label>
                                        <input name="packingDetails" value={formData.packingDetails} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder="e.g. 10 Tabs/Strip" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹) *</label>
                                        <input required type="number" name="mrp" value={formData.mrp} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                                        <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                        <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* Dates & Logistics */}
                            <section>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" /> Dates & Logistics
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                                        <input required type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Date</label>
                                        <input type="date" name="manufacturingDate" value={formData.manufacturingDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                                        <input name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder="e.g. 24 hours" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Qty</label>
                                        <input type="number" name="minimumOrderQuantity" value={formData.minimumOrderQuantity} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                    </div>

                                    <div className="flex items-center mt-4">
                                        <input type="checkbox" id="rxReq" name="isPrescriptionRequired" checked={formData.isPrescriptionRequired} onChange={handleInputChange} className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                                        <label htmlFor="rxReq" className="ml-2 block text-sm text-gray-900 font-medium">Prescription Required</label>
                                    </div>
                                </div>
                            </section>

                            {/* Location Override */}
                            <section className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" /> Specific Location (Optional)
                                    </h4>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="useLoc" checked={useCustomLocation} onChange={(e) => setUseCustomLocation(e.target.checked)} className="h-4 w-4 text-green-600" />
                                        <label htmlFor="useLoc" className="ml-2 text-sm text-gray-600">Different from Store Location</label>
                                    </div>
                                </div>
                                {useCustomLocation && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <input name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" placeholder="Detailed address" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                            <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Images */}
                            <section>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (Max 5)</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><Minus className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    {previews.length < 5 && (
                                        <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 aspect-square">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-2">Upload</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} multiple />
                                        </label>
                                    )}
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 border-t">
                            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100">Cancel</button>
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50">
                                {loading ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
