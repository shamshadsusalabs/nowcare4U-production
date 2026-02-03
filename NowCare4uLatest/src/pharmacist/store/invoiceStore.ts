import { create } from 'zustand';
import type { Invoice } from '../types/invoice.types';
import { invoiceService } from '../service/invoice.service';

interface InvoiceStore {
    invoices: Invoice[];
    currentInvoice: Invoice | null;
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        pages: number;
    } | null;

    fetchInvoices: (token: string, params?: any) => Promise<void>;
    fetchInvoiceById: (token: string, id: string) => Promise<void>;
    createInvoice: (token: string, data: any) => Promise<void>;
    updateInvoiceStatus: (token: string, id: string, status: string, paymentDetails?: any) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
    pagination: null,

    fetchInvoices: async (token, params) => {
        set({ loading: true, error: null });
        try {
            const response = await invoiceService.getInvoices(token, params);
            set({
                invoices: response.data,
                pagination: response.pagination,
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch invoices',
                loading: false
            });
        }
    },

    fetchInvoiceById: async (token, id) => {
        set({ loading: true, error: null });
        try {
            const invoice = await invoiceService.getInvoiceById(token, id);
            set({ currentInvoice: invoice, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch invoice',
                loading: false
            });
        }
    },

    createInvoice: async (token, data) => {
        set({ loading: true, error: null });
        try {
            const newInvoice = await invoiceService.createInvoice(token, data);
            set(state => ({
                invoices: [newInvoice, ...state.invoices],
                loading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create invoice',
                loading: false
            });
            throw error;
        }
    },

    updateInvoiceStatus: async (token, id, status, paymentDetails) => {
        set({ loading: true, error: null });
        try {
            const updatedInvoice = await invoiceService.updateStatus(token, id, status, paymentDetails);
            set(state => ({
                invoices: state.invoices.map(inv => inv._id === id ? updatedInvoice : inv),
                currentInvoice: state.currentInvoice?._id === id ? updatedInvoice : state.currentInvoice,
                loading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update invoice status',
                loading: false
            });
            throw error;
        }
    }
}));
