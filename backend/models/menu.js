const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter menu name']
    },
    category: {
        type: String,
        required: [true, 'Please enter menu category']
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, {
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

menuSchema.virtual('foodItems', {
    ref: 'FoodItem',
    localField: '_id',
    foreignField: 'menu'
});

module.exports = mongoose.model('Menu', menuSchema);
