import { useState, useEffect } from 'react';
import { usePharmacistStore } from '../store/pharmacistStore';
import { useProductStore } from '../store/productStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { Plus, Trash2, Save, Printer, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateInvoiceProps {
    onSuccess?: () => void;
}



export default function CreateInvoice({ onSuccess }: CreateInvoiceProps) {
    const { token, pharmacist } = usePharmacistStore(); // Get pharmacist details
    const navigate = useNavigate();
    const { products, fetchMyProducts } = useProductStore();
    const { createInvoice, loading: invoiceLoading } = useInvoiceStore();

    // Form State
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        gstin: '',
        address: ''
    });

    const [items, setItems] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [invoiceDate] = useState(new Date().toISOString().split('T')[0]);

    // Load products on mount
    useEffect(() => {
        if (token) fetchMyProducts();
    }, [token]);

    const handleAddItem = () => {
        if (!selectedProduct) return;

        const product = products.find(p => p._id === selectedProduct);
        if (!product) return;

        // Check availability
        if (product.stock <= 0) {
            alert('Product is out of stock!');
            return;
        }

        const newItem = {
            product: product._id,
            name: product.name,
            brand: product.brand,
            batchNumber: 'BATCH-' + Math.floor(Math.random() * 10000), // Placeholder logic
            expiryDate: product.expiryDate,
            quantity: 1,
            unit: product.unit,
            price: product.price,
            discount: 0,
            cgstRate: 9,
            sgstRate: 9,
        };

        setItems([...items, newItem]);
        setSelectedProduct('');
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalTax = 0;
        let grandTotal = 0;

        items.forEach(item => {
            const qty = Number(item.quantity);
            const price = Number(item.price);
            const discount = Number(item.discount);

            const taxable = (price * qty) - discount;
            const tax = taxable * ((item.cgstRate + item.sgstRate) / 100);

            subtotal += (price * qty);
            totalTax += tax;
            grandTotal += (taxable + tax);
        });

        return { subtotal, totalTax, grandTotal };
    };

    const { subtotal, totalTax, grandTotal } = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (items.length === 0) {
            alert('Please add at least one item');
            return;
        }

        try {
            await createInvoice(token, {
                customer,
                items,
                billingAddress: { // Basic billing address from customer data for now
                    addressLine1: customer.address || 'N/A',
                    city: 'N/A',
                    state: 'N/A',
                    pincode: 'N/A',
                    country: 'India'
                },
                status: 'Paid',
                paymentDetails: {
                    method: 'Cash',
                    paymentDate: new Date(),
                    isPaid: true
                }
            });
            alert('Invoice created successfully!');
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/pharmacist/invoices');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create invoice');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">New Invoice Statement</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center shadow-sm">
                        <Printer className="w-4 h-4 mr-2" /> Print Preview
                    </button>
                </div>
            </div>

            {/* Invoice Paper */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Invoice Header */}
                <div className="bg-gray-50 p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        {/* From Section */}
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-green-600" />
                                {pharmacist?.name || 'Pharmacy Name'}
                            </h2>
                            <div className="text-sm text-gray-500 space-y-0.5">
                                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {pharmacist?.address || 'Pharmacy Address'}, {pharmacist?.city}-{pharmacist?.pincode}</p>
                                <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {pharmacist?.phoneNumber || 'Phone'}</p>
                                <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {pharmacist?.email || 'Email'}</p>
                                <p className="text-xs mt-2 font-medium">GSTIN: {pharmacist?.gstNumber || 'N/A'} | DL: {pharmacist?.licenseNumber || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Invoice Meta */}
                        <div className="text-right">
                            <h2 className="text-4xl font-light text-gray-300 uppercase tracking-widest mb-2">Invoice</h2>
                            <div className="space-y-2">
                                <div className="flex justify-end items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600">Date:</span>
                                    <input
                                        type="date"
                                        value={invoiceDate}
                                        disabled
                                        className="bg-gray-100 border text-gray-600 rounded px-2 py-1 text-sm text-right w-32"
                                    />
                                </div>
                                <div className="flex justify-end items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600">Invoice #:</span>
                                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-sm font-medium border border-yellow-100">Auto-Generated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To Section */}
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bill To</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Customer Name</label>
                            <input
                                type="text"
                                placeholder="Enter Full Name"
                                required
                                className="w-full text-lg font-medium border-b-2 border-gray-100 focus:border-green-500 outline-none py-1 placeholder:text-gray-300 transition-colors"
                                value={customer.name}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter Phone"
                                required
                                className="w-full text-gray-700 border-b-2 border-gray-100 focus:border-green-500 outline-none py-1 placeholder:text-gray-300 transition-colors"
                                value={customer.phone}
                                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Email Address (Optional)</label>
                            <input
                                type="email"
                                placeholder="customer@example.com"
                                className="w-full text-gray-700 border-b-2 border-gray-100 focus:border-green-500 outline-none py-1 placeholder:text-gray-300 transition-colors"
                                value={customer.email}
                                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Address / GSTIN (Optional)</label>
                            <input
                                type="text"
                                placeholder="Address or GST Number"
                                className="w-full text-gray-700 border-b-2 border-gray-100 focus:border-green-500 outline-none py-1 placeholder:text-gray-300 transition-colors"
                                value={customer.address}
                                onChange={e => setCustomer({ ...customer, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="p-8">
                    {/* Add Product Bar */}
                    <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex-1">
                            <select
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                                value={selectedProduct}
                                onChange={e => setSelectedProduct(e.target.value)}
                            >
                                <option value="">🔍 Search and Select Product to Add...</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.name} - {p.brand} (Stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 flex items-center shadow-lg transform active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Add Item
                        </button>
                    </div>

                    {/* Table */}
                    <div className="min-h-[200px]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Details</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-24 text-center">Batch</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-20 text-center">Qty</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-24 text-right">Price</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-24 text-right">Disc</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-20 text-right">Tax</th>
                                    <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-28 text-right">Amount</th>
                                    <th className="pb-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-gray-400 italic">
                                            No items added. Select a product above to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-gray-50">
                                            <td className="py-4 text-sm text-gray-500">{idx + 1}</td>
                                            <td className="py-4">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.brand}</p>
                                            </td>
                                            <td className="py-4 text-xs text-center text-gray-500 font-mono bg-gray-50 rounded mx-1 px-1">
                                                {item.batchNumber}
                                            </td>
                                            <td className="py-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-16 text-center border border-gray-200 rounded p-1 text-sm focus:border-green-500 outline-none"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="py-4 text-right text-sm">₹{item.price}</td>
                                            <td className="py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-16 text-right border border-gray-200 rounded p-1 text-sm focus:border-green-500 outline-none ml-auto block"
                                                    value={item.discount}
                                                    onChange={e => updateItem(idx, 'discount', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="py-4 text-right text-xs text-gray-500">
                                                {item.cgstRate + item.sgstRate}%
                                            </td>
                                            <td className="py-4 text-right font-medium text-gray-900">
                                                ₹{((item.price * item.quantity) - item.discount +
                                                    ((item.price * item.quantity - item.discount) * (item.cgstRate + item.sgstRate) / 100)).toFixed(2)}
                                            </td>
                                            <td className="py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(idx)}
                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Section: Notes & Totals */}
                <div className="bg-gray-50 p-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="md:w-1/2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Notes / Payment Terms</label>
                            <textarea
                                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600 focus:border-green-500 outline-none resize-none h-24"
                                placeholder="Add notes, payment instructions, or thank you message..."
                            ></textarea>
                        </div>
                        <div className="md:w-1/3 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (GST)</span>
                                <span>₹{totalTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Discount</span>
                                <span>-₹0.00</span>
                            </div>
                            <div className="h-px bg-gray-200 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Grand Total</span>
                                <span className="text-2xl font-bold text-purple-600">₹{grandTotal.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={invoiceLoading || items.length === 0}
                                className="w-full mt-4 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {invoiceLoading ? 'Processing...' : (
                                    <>
                                        <Save className="w-5 h-5" /> Generate Invoice
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
