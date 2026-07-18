const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: String,
            price: { type: Number, required: true },
            foodItem: {
                type: mongoose.Schema.ObjectId,
                ref: 'FoodItem',
                required: true
            },
            variants: [{
                name: String,
                option: String
            }]
        }
    ],
    deliveryInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        phoneNo: { type: String, required: true },
        postalCode: String,
        country: { type: String, required: true },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    paymentInfo: {
        id: String,
        status: { type: String, enum: ['pending', 'completed', 'failed'] },
        method: { type: String, enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'] }
    },
    paidAt: Date,
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    deliveryPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    discountAmount: {
        type: Number,
        default: 0.0
    },
    coupon: {
        code: String,
        discountType: String,
        discountValue: Number
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'OutForDelivery', 'Delivered', 'Cancelled', 'Failed']
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        notes: String
    }],
    estimatedDeliveryTime: {
        type: Number,
        description: 'Estimated delivery time in minutes'
    },
    actualDeliveryTime: Number,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    specialInstructions: String,
    estimatedPickupTime: Date,
    rating: {
        score: { type: Number, min: 0, max: 5 },
        review: String,
        images: [String],
        ratedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
