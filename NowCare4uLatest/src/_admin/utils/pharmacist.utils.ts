export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const validatePharmacistForm = (formData: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber?.trim()) {
        errors.phoneNumber = 'Phone is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password?.trim()) {
        errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.licenseNumber?.trim()) errors.licenseNumber = 'License number is required';

    if (!formData.gstNumber?.trim()) {
        errors.gstNumber = 'GST number is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
        errors.gstNumber = 'Please enter a valid 15-character GST number (e.g., 22AAAAA0000A1Z5)';
    }

    // Optional field validation (only if provided)
    if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber)) {
        errors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
    }

    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
        errors.panNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    return errors;
};

export const validateFileSize = (file: File, maxSizeMB = 2): boolean => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
};
