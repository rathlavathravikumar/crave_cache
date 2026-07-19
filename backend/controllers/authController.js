const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const connectDatabase = require('../config/db');
const { isDatabaseReady, addFallbackUser, getFallbackUserByEmail, getFallbackUserById, compareFallbackPassword, createFallbackToken, updateFallbackUser } = require('../utils/fallbackData');
const { uploadToCloudinary } = require('../utils/cloudinary');
const upload = require('../middlewares/upload');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
        return next(new ErrorHandler('Please fill all required fields', 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // continue with fallback user handling if the database is unavailable
        }
    }

    if (!isDatabaseReady()) {
        const user = await addFallbackUser({ name, email, password, phone, role: role || 'user' });
        return res.status(201).json({ success: true, token: createFallbackToken(user), user });
    }

    const user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        confirmPassword,
        phone,
        role: role || 'user',
        avatar: {
            public_id: req.body.avatar?.public_id || 'default_avatar_id',
            url: req.body.avatar?.url || 'https://res.cloudinary.com/demo/image/upload/v1622543328/sample.jpg'
        }
    });

    sendToken(user, 201, res);
});

// Login user  =>   /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password are entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // continue with fallback user handling if the database is unavailable
        }
    }

    if (!isDatabaseReady()) {
        const user = getFallbackUserByEmail(email);
        if (!user) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }
        const isPasswordMatched = await compareFallbackPassword(password, user.password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }
        return res.status(200).json({ success: true, token: createFallbackToken(user), user });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);
});

// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
});

// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // continue with fallback profile handling if the database is unavailable
        }
    }

    if (!isDatabaseReady()) {
        const { getFallbackUserById } = require('../utils/fallbackData');
        const user = getFallbackUserById(req.user.id);
        return res.status(200).json({ success: true, user });
    }

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to fallback handling
        }
    }

    const updates = {
        name: req.body.name,
        phone: req.body.phone,
        avatar: req.body.avatar ? {
            public_id: req.body.avatar.public_id || 'default_avatar_id',
            url: req.body.avatar.url || 'https://res.cloudinary.com/demo/image/upload/v1622543328/sample.jpg'
        } : undefined,
        addresses: req.body.addresses,
    };

    if (!isDatabaseReady()) {
        const existingUser = getFallbackUserById(req.user.id);
        if (!existingUser) {
            return next(new ErrorHandler('User not found', 404));
        }

        const updatedUser = updateFallbackUser(req.user.id, {
            ...existingUser,
            name: updates.name || existingUser.name,
            phone: updates.phone || existingUser.phone,
            avatar: updates.avatar || existingUser.avatar,
            addresses: updates.addresses || existingUser.addresses || []
        });

        return res.status(200).json({ success: true, user: updatedUser });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    if (typeof req.body.name === 'string') user.name = req.body.name;
    if (typeof req.body.phone === 'string') user.phone = req.body.phone;
    if (req.body.avatar) {
        user.avatar = {
            public_id: req.body.avatar.public_id || user.avatar?.public_id || 'default_avatar_id',
            url: req.body.avatar.url || user.avatar?.url || 'https://res.cloudinary.com/demo/image/upload/v1622543328/sample.jpg'
        };
    }
    if (Array.isArray(req.body.addresses)) {
        user.addresses = req.body.addresses;
    }

    await user.save();

    res.status(200).json({ success: true, user });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler('Please provide current password, new password and confirm password', 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('New password and confirm password do not match', 400));
    }

    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to fallback handling
        }
    }

    if (!isDatabaseReady()) {
        const fallbackUser = getFallbackUserById(req.user.id);
        if (!fallbackUser) {
            return next(new ErrorHandler('User not found', 404));
        }

        const isPasswordMatched = await compareFallbackPassword(oldPassword, fallbackUser.password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Current password is incorrect', 400));
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Current password is incorrect', 400));
    }

    user.password = newPassword;
    user.confirmPassword = confirmPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Upload user avatar => /api/v1/me/avatar
exports.uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler('Please upload an image file', 400));
    }

    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to fallback handling
        }
    }

    try {
        // Convert buffer to base64 for Cloudinary
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Upload to Cloudinary
        const avatarData = await uploadToCloudinary(base64Image, 'avatars');

        if (!isDatabaseReady()) {
            const existingUser = getFallbackUserById(req.user.id);
            if (!existingUser) {
                return next(new ErrorHandler('User not found', 404));
            }

            const updatedUser = updateFallbackUser(req.user.id, {
                ...existingUser,
                avatar: avatarData
            });

            return res.status(200).json({ success: true, user: updatedUser });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Delete old avatar if it exists and is not default
        if (user.avatar?.public_id && user.avatar.public_id !== 'default_avatar_id') {
            const { deleteFromCloudinary } = require('../utils/cloudinary');
            await deleteFromCloudinary(user.avatar.public_id);
        }

        user.avatar = avatarData;
        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to upload avatar', 500));
    }
});
