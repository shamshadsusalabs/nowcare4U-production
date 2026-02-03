import { useEffect, useState } from 'react';
import { Search, Eye, Trash2, Package, MapPin, Store, X } from 'lucide-react';
import { useAdminAuth } from '../AdminContext';
import { useProductStore } from '../store/product.store';
import type { AdminProduct } from '../types/product.types';

const ProductManagement = () => {
    const { token } = useAdminAuth();
    const { products, loading, fetchProducts, deleteProduct } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

    useEffect(() => {
        if (token) {
            fetchProducts(token);
        }
    }, [token, fetchProducts]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pharmacist?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!token) return;
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(token, id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by product, pharmacist, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pharmacist</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (MRP)</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading products...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{product.composition}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{product.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Store className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{product.pharmacist?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 pl-5">{product.pharmacist?.city}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock} {product.unit}s
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium">₹{product.price}</div>
                                            <div className="text-xs text-gray-400 line-through">₹{product.mrp}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={() => setSelectedProduct(null)}></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10">
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Product Details
                                </h3>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Images */}
                                    <div className="col-span-1 space-y-4">
                                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                                            {selectedProduct.images?.[0] ? (
                                                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {selectedProduct.images?.slice(1).map((img, i) => (
                                                <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="col-span-1 md:col-span-2 space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                            <p className="text-gray-500">{selectedProduct.composition}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{selectedProduct.category}</span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">Brand: {selectedProduct.brand}</span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">Mfr: {selectedProduct.manufacturer}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 uppercase">Price</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-bold text-green-600">₹{selectedProduct.price}</span>
                                                    <span className="text-sm text-gray-400 line-through">₹{selectedProduct.mrp}</span>
                                                    {selectedProduct.discount && <span className="text-xs text-green-600">({selectedProduct.discount}% OFF)</span>}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 uppercase">Stock</p>
                                                <p className="text-lg font-semibold">{selectedProduct.stock} {selectedProduct.unit}s</p>
                                                <p className="text-xs text-gray-500">{selectedProduct.packingDetails}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 border-t pt-4">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2"><Store className="w-4 h-4" /> Pharmacist Details</h4>
                                            <div className="text-sm text-gray-600">
                                                <p className="font-medium text-gray-900">{selectedProduct.pharmacist?.name}</p>
                                                <p>{selectedProduct.pharmacist?.phoneNumber}</p>
                                                <p>{selectedProduct.pharmacist?.address}, {selectedProduct.pharmacist?.city}, {selectedProduct.pharmacist?.pincode}</p>
                                            </div>
                                        </div>

                                        {selectedProduct.location && (
                                            <div className="space-y-3 border-t pt-4">
                                                <h4 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4" /> Product Location (Override)</h4>
                                                <div className="text-sm text-gray-600">
                                                    <p>{selectedProduct.location.address}</p>
                                                    <p>{selectedProduct.location.city} - {selectedProduct.location.pincode}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Expiry Date</p>
                                                <p className="font-medium">{new Date(selectedProduct.expiryDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Mfg Date</p>
                                                <p className="font-medium">{selectedProduct.manufacturingDate ? new Date(selectedProduct.manufacturingDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Delivery Time</p>
                                                <p className="font-medium">{selectedProduct.deliveryTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Min Order Qty</p>
                                                <p className="font-medium">{selectedProduct.minimumOrderQuantity}</p>
                                            </div>
                                        </div>

                                        {selectedProduct.description && (
                                            <div className="border-t pt-4">
                                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                                <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
