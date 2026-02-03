export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface BankDetails {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
}

export interface InvoiceItem {
    product: string; // Product ID
    name: string;
    brand?: string;
    batchNumber: string;
    expiryDate: string;
    hsnCode?: string;
    quantity: number;
    unit: string;
    price: number;
    discount: number;
    taxableAmount: number;
    cgstRate: number;
    cgstAmount: number;
    sgstRate: number;
    sgstAmount: number;
    igstRate: number;
    igstAmount: number;
    total: number;
}

export interface PaymentDetails {
    method: 'Cash' | 'Card' | 'UPI' | 'NetBanking' | 'Other';
    transactionId?: string;
    paymentDate: string;
    isPaid: boolean;
}

export interface VendorDetails {
    name: string;
    address: string;
    gstNumber?: string;
    licenseNumber?: string;
    email?: string;
    phone?: string;
}

export interface CustomerDetails {
    name: string;
    email?: string;
    phone: string;
    gstin?: string;
    address?: string;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    pharmacist: string;
    vendorDetails: VendorDetails;
    customer: CustomerDetails;
    items: InvoiceItem[];
    billingAddress: Address;
    shippingAddress: Address;
    bankDetails?: BankDetails;

    subtotal: number;
    totalDiscount: number;
    taxableAmount: number;
    totalTax: number;
    shippingCharges: number;
    roundOff: number;
    grandTotal: number;

    status: 'Draft' | 'Pending' | 'Paid' | 'Cancelled' | 'Overdue';
    issueDate: string;
    dueDate?: string;
    paymentDetails?: PaymentDetails;

    termsAndConditions?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInvoicePayload {
    customer: CustomerDetails;
    items: Omit<InvoiceItem, 'total' | 'taxableAmount' | 'cgstAmount' | 'sgstAmount' | 'igstAmount'>[]; // Backend calculates these
    billingAddress: Address;
    shippingAddress?: Address;
    bankDetails?: BankDetails;
    shippingCharges?: number;
    status: string;
    dueDate?: string;
    paymentDetails?: PaymentDetails;
    notes?: string;
    termsAndConditions?: string;
}
