const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [50, 'Your name cannot exceed 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Your password must be at least 8 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    avatar: {
        public_id: {
            type: String,
            default: 'default_avatar_id'
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/demo/image/upload/v1622543328/sample.jpg'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'restaurant_admin'],
            message: 'Please select correct role'
        },
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    addresses: [{
        label: { type: String, default: 'Home' },
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        isDefault: { type: Boolean, default: false }
    }],
    preferences: {
        newsletter: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false }
    },
    favoriteFoodItems: [{
        type: mongoose.Schema.ObjectId,
        ref: 'FoodItem',
        default: []
    }],
    favoriteRestaurants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        default: []
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.pre('save', async function(next) {
    if (this.confirmPassword && this.password !== this.confirmPassword) {
        return next(new ErrorHandler('Password and confirm password do not match', 400));
    }

    if (!this.isModified('password')) {
        this.confirmPassword = undefined;
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', userSchema);
