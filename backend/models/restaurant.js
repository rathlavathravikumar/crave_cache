const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter restaurant name'],
        trim: true,
        maxLength: [100, 'Restaurant name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter restaurant description'],
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    location: {
        type: String,
        required: [true, 'Please enter restaurant location']
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    cuisine: [String],
    cuisineMain: String,
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    banner: {
        public_id: String,
        url: String
    },
    minimumOrderValue: {
        type: Number,
        default: 0
    },
    deliveryTime: {
        type: Number,
        default: 30,
        description: 'Delivery time in minutes'
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    specials: [String],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [String],
    metrics: {
        totalOrders: { type: Number, default: 0 },
        acceptanceRate: { type: Number, default: 100 },
        averageRating: { type: Number, default: 0 }
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
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ 'coordinates': '2dsphere' });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ isOpen: 1 });

// Update search ratings
restaurantSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
