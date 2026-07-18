const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter food item name'],
        trim: true,
        maxLength: [100, 'Food item name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter food item price'],
        maxLength: [8, 'Food item price cannot exceed 8 figures'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter food item description'],
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    stock: {
        type: Number,
        required: [true, 'Please enter food item stock'],
        maxLength: [5, 'Food item stock cannot exceed 5 figures'],
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    menu: {
        type: mongoose.Schema.ObjectId,
        ref: 'Menu',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    variants: [{
        name: String,
        options: [{
            name: String,
            price: Number
        }]
    }],
    ingredients: [String],
    nutrition: {
        calories: Number,
        protein: String,
        carbs: String,
        fat: String,
        fiber: String
    },
    allergens: [String],
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isVegan: {
        type: Boolean,
        default: false
    },
    isSpicy: {
        type: Boolean,
        default: false
    },
    spicyLevel: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0
    },
    offers: [{
        type: String,
        description: String,
        discount: Number
    }],
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
    preparationTime: {
        type: Number,
        default: 15,
        description: 'Preparation time in minutes'
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    aiGeneratedDescription: String,
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
foodItemSchema.index({ name: 'text', description: 'text' });
foodItemSchema.index({ restaurant: 1 });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ rating: -1 });
foodItemSchema.index({ isAvailable: 1 });

foodItemSchema.virtual('displayPrice').get(function() {
    return this.price;
});

foodItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
