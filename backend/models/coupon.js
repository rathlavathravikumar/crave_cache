const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please enter coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 200
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'free_delivery'],
        required: true
    },
    discountValue: {
        type: Number,
        required: function() {
            return this.discountType !== 'free_delivery';
        }
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    applicableCategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    }],
    applicableRestaurants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant'
    }],
    applicableFoodItems: [{
        type: mongoose.Schema.ObjectId,
        ref: 'FoodItem'
    }],
    userLimit: {
        type: Number,
        default: 1
    },
    usageCount: {
        type: Number,
        default: 0
    },
    maxUsageCount: {
        type: Number,
        default: null
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
couponSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ createdBy: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && 
           now >= this.startDate && 
           now <= this.endDate &&
           (this.maxUsageCount === null || this.usageCount < this.maxUsageCount);
};

module.exports = mongoose.model('Coupon', couponSchema);
