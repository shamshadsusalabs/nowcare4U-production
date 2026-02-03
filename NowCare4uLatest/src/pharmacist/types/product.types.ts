export interface ProductLinkLocation {
    address?: string;
    city?: string;
    pincode?: string;
    coordinates?: {
        lat: number;
        lng: number;
    }
}

export interface Product {
    _id: string;
    name: string;
    composition?: string;
    brand?: string;
    manufacturer?: string;
    category: 'Tablet' | 'Syrup' | 'Injection' | 'Capsule' | 'Cream' | 'Gel' | 'Drops' | 'Powder' | 'Equipment' | 'Other';
    description?: string;
    images: string[];

    // Inventory
    stock: number;
    unit: string;
    packingDetails?: string;

    // Dates
    expiryDate: string; // ISO Date string
    manufacturingDate?: string;

    // Pricing
    mrp: number;
    price: number;
    discount?: number;

    // Logistics
    deliveryTime?: string;
    minimumOrderQuantity?: number;
    isPrescriptionRequired: boolean;

    // Location
    location?: ProductLinkLocation;

    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    composition?: string;
    brand?: string;
    manufacturer?: string;
    category: string;
    description?: string;

    stock: string; // Form inputs are usually strings
    unit: string;
    packingDetails?: string;

    expiryDate: string;
    manufacturingDate?: string;

    mrp: string;
    price: string;
    discount?: string;

    deliveryTime?: string;
    minimumOrderQuantity?: string;
    isPrescriptionRequired: boolean;

    address?: string;
    city?: string;
    pincode?: string;
    lat?: string;
    lng?: string;

    images?: File[];
}
