export interface AdminProduct {
    _id: string;
    pharmacist: {
        _id: string;
        name: string;
        phoneNumber: string;
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        isVerified: boolean;
    };
    name: string;
    composition?: string;
    brand?: string;
    manufacturer?: string;
    category: string;
    description?: string;
    images: string[];

    // Inventory
    stock: number;
    unit: string;
    packingDetails?: string;

    // Dates
    expiryDate: string;
    manufacturingDate?: string;

    // Pricing
    mrp: number;
    price: number;
    discount?: number;

    // Logistics
    deliveryTime?: string;
    minimumOrderQuantity?: number;
    isPrescriptionRequired: boolean;
    isAvailable: boolean;

    // Location (Product specific override)
    location?: {
        address?: string;
        city?: string;
        pincode?: string;
        coordinates?: {
            lat: number;
            lng: number;
        }
    };

    createdAt: string;
    updatedAt: string;
}

export interface ProductState {
    products: AdminProduct[];
    loading: boolean;
    error: string | null;
}
