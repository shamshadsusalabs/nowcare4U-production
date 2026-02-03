export interface Pharmacist {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    gstNumber: string;
    aadharNumber?: string;
    panNumber?: string;
    aadharFile?: string;
    panFile?: string;
    licenseFile?: string;
    gstFile?: string;
    isApproved: boolean;
    isVerified: boolean;
    rejectionReason?: string;
    createdAt: string;
    updatedAt?: string;
    approvedAt?: string;
    approvedBy?: string;
}

export interface PharmacistFormData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    licenseNumber: string;
    gstNumber: string;
    aadharNumber: string;
    panNumber: string;
    aadharFile: File | null;
    panFile: File | null;
    licenseFile: File | null;
    gstFile: File | null;
}
