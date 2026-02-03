export interface Pharmacist {
    id: string
    name: string
    email: string
    phoneNumber: string
    licenseNumber: string
    gstNumber: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    isApproved: boolean
    isVerified: boolean
    profileCompleted: boolean
    image?: string
    aadharFile?: string
    panFile?: string
    licenseFile?: string
    gstFile?: string
}

export interface PharmacistState {
    pharmacist: Pharmacist | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

export * from './product.types'
export * from './invoice.types'
