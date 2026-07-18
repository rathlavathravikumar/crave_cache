// Validation utilities
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};

const validatePostalCode = (code, country = 'IN') => {
    const patterns = {
        'IN': /^\d{6}$/,
        'US': /^\d{5}(-\d{4})?$/,
        'UK': /^[A-Z]{1,2}[\dR][A-Z\d]?\s?[\dA-Z]{3}$/i
    };
    const pattern = patterns[country] || patterns['IN'];
    return pattern.test(code);
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const validateOrderData = (orderData) => {
    const errors = [];
    
    if (!orderData.deliveryInfo) {
        errors.push('Delivery information is required');
    }
    if (!orderData.paymentInfo) {
        errors.push('Payment information is required');
    }
    if (!Array.isArray(orderData.orderItems) || orderData.orderItems.length === 0) {
        errors.push('Order must contain at least one item');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateRestaurantData = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Restaurant name is required');
    }
    if (!data.description || data.description.trim().length === 0) {
        errors.push('Restaurant description is required');
    }
    if (!data.location || data.location.trim().length === 0) {
        errors.push('Restaurant location is required');
    }
    if (!data.cuisine || !Array.isArray(data.cuisine) || data.cuisine.length === 0) {
        errors.push('At least one cuisine type is required');
    }
    if (!data.coordinates || !data.coordinates.latitude || !data.coordinates.longitude) {
        errors.push('Restaurant coordinates are required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const calculateTaxAmount = (amount, taxRate = 0.05) => {
    return parseFloat((amount * taxRate).toFixed(2));
};

const calculateDiscount = (amount, coupon) => {
    if (!coupon) return 0;
    
    if (coupon.discountType === 'percentage') {
        let discount = (amount * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
            discount = Math.min(discount, coupon.maxDiscountAmount);
        }
        return discount;
    } else if (coupon.discountType === 'fixed') {
        return coupon.discountValue;
    }
    
    return 0;
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,
    validatePostalCode,
    sanitizeInput,
    validateOrderData,
    validateRestaurantData,
    calculateTaxAmount,
    calculateDiscount
};
