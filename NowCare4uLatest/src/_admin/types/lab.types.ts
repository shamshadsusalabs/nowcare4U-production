export interface Lab {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    labLicenseNumber: string;
    gstNumber: string;
    aadharNumber?: string;
    panNumber?: string;
    aadharFile?: string;
    panFile?: string;
    labLicenseFile?: string;
    gstFile?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isApproved: boolean;
    isVerified: boolean;
    rejectionReason?: string;
    createdAt: string;
    updatedAt?: string;
    approvedAt?: string;
    approvedBy?: string;
}

export interface LabFormData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    labLicenseNumber: string;
    gstNumber: string;
    aadharNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    aadharFile: File | null;
    panFile: File | null;
    labLicenseFile: File | null;
    gstFile: File | null;
}

export interface LabTest {
    _id: string;
    labId: string | Lab;
    testName: string;
    category: string;
    description: string;
    price: number;
    discountedPrice?: number;
    location: {
        address: string;
        city: string;
        pincode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    sampleType?: string;
    preTestRequirements?: string[];
    reportTurnaroundTime?: string;
    ageGroup?: string;
    gender?: 'Male' | 'Female' | 'Both';
    isHomeCollectionAvailable: boolean;
    homeCollectionCharges?: number;
    isActive: boolean;
}
