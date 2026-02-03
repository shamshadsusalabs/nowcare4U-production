export interface Doctor {
    _id: string;
    name: string;
    email: string;
    phone: string;
    speciality: string;
    experience: string;
    qualification: string;
    location: string;
    consultationFee: string;
    licenseNumber: string;
    languages: string[];
    image: string;
    profileCompleted: boolean;
    isVerified: boolean;
    rating: number;
    totalReviews: number;
    isApproved?: boolean;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
}

export interface DoctorFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
    speciality: string;
    experience: string;
    qualification: string;
    location: string;
    consultationFee: string;
    licenseNumber: string;
    languages: string[];
}
