import axios from 'axios';
import type { Invoice, CreateInvoicePayload } from '../types/invoice.types';

const API_URL = 'https://nowcare4-u-production-acbz.vercel.app/api/invoices';

export const invoiceService = {
    // Get all invoices with filtering
    getInvoices: async (token: string, params?: any): Promise<{ data: Invoice[], pagination: any }> => {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params
        });
        return response.data;
    },

    // Get single invoice
    getInvoiceById: async (token: string, id: string): Promise<Invoice> => {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    // Create invoice
    createInvoice: async (token: string, data: CreateInvoicePayload): Promise<Invoice> => {
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    // Update status
    updateStatus: async (token: string, id: string, status: string, paymentDetails?: any): Promise<Invoice> => {
        const response = await axios.put(`${API_URL}/${id}/status`,
            { status, paymentDetails },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    }
};
