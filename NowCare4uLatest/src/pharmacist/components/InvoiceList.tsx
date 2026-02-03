import { useEffect } from 'react';
import { usePharmacistStore } from '../store/pharmacistStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { Plus, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvoiceListProps {
    onCreate?: () => void;
}

export default function InvoiceList({ onCreate }: InvoiceListProps) {
    const { token } = usePharmacistStore();
    const navigate = useNavigate();
    const { invoices, fetchInvoices, loading } = useInvoiceStore();

    useEffect(() => {
        if (token) fetchInvoices(token);
    }, [token]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-500">Manage billing and history</p>
                </div>
                <button
                    onClick={() => onCreate ? onCreate() : navigate('/pharmacist/invoices/new')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" /> New Invoice
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading invoices...</div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                    <FileText className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">No invoices generated yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoices.map(invoice => (
                                <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-purple-600">{invoice.invoiceNumber}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{invoice.customer.name}</div>
                                        <div className="text-xs text-gray-500">{invoice.customer.phone}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(invoice.issueDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium">
                                        ₹{invoice.grandTotal.toFixed(2)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                            invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            } `}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-gray-400 hover:text-purple-600">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
