export interface Lab {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    labLicenseNumber: string;
    gstNumber: string;
    aadharNumber?: string;
    panNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isApproved: boolean;
    isVerified: boolean;
    aadharFile?: string;
    panFile?: string;
    labLicenseFile?: string;
    gstFile?: string;
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

export interface LabState {
    lab: Lab | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
