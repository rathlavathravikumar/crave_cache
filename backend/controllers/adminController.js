const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
const FoodItem = require('../models/foodItem');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const connectDatabase = require('../config/db');
const { isDatabaseReady } = require('../utils/fallbackData');

// Get admin statistics => /api/v1/admin/statistics
exports.getAdminStatistics = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to fallback handling
        }
    }

    try {
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find({ paymentInfo: { status: 'completed' } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const activeRestaurants = await Restaurant.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

        res.status(200).json({
            success: true,
            statistics: {
                totalOrders,
                totalRevenue,
                activeRestaurants,
                pendingOrders
            }
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to fetch statistics', 500));
    }
});

// Get all orders (admin) => /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to fetch orders', 500));
    }
});

// Update order status (admin) => /api/v1/admin/orders/:id/status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'OutForDelivery', 'Delivered', 'Cancelled', 'Failed'];

        if (!validStatuses.includes(status)) {
            return next(new ErrorHandler('Invalid order status', 400));
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        order.orderStatus = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            notes: `Status updated by admin`
        });

        await order.save();

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to update order status', 500));
    }
});

// Update restaurant (admin) => /api/v1/admin/restaurants/:id
exports.updateRestaurant = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return next(new ErrorHandler('Restaurant not found', 404));
        }

        const { name, description, location, rating, cuisineType, deliveryTime, priceRange } = req.body;

        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (location) restaurant.location = location;
        if (rating !== undefined) restaurant.rating = rating;
        if (cuisineType) restaurant.cuisineType = cuisineType;
        if (deliveryTime) restaurant.deliveryTime = deliveryTime;
        if (priceRange) restaurant.priceRange = priceRange;

        await restaurant.save();

        res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to update restaurant', 500));
    }
});

// Delete restaurant (admin) => /api/v1/admin/restaurants/:id
exports.deleteRestaurant = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return next(new ErrorHandler('Restaurant not found', 404));
        }

        // Delete restaurant images from Cloudinary
        if (restaurant.images && restaurant.images.length > 0) {
            const { deleteFromCloudinary } = require('../utils/cloudinary');
            for (const image of restaurant.images) {
                if (image.public_id) {
                    await deleteFromCloudinary(image.public_id);
                }
            }
        }

        await Restaurant.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Restaurant deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to delete restaurant', 500));
    }
});

// Update food item (admin) => /api/v1/admin/fooditems/:id
exports.updateFoodItem = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        let foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return next(new ErrorHandler('Food item not found', 404));
        }

        const { name, description, price, category, isAvailable, isVegetarian, isSpicy } = req.body;

        if (name) foodItem.name = name;
        if (description) foodItem.description = description;
        if (price !== undefined) foodItem.price = price;
        if (category) foodItem.category = category;
        if (isAvailable !== undefined) foodItem.isAvailable = isAvailable;
        if (isVegetarian !== undefined) foodItem.isVegetarian = isVegetarian;
        if (isSpicy !== undefined) foodItem.isSpicy = isSpicy;

        await foodItem.save();

        res.status(200).json({
            success: true,
            foodItem
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to update food item', 500));
    }
});

// Delete food item (admin) => /api/v1/admin/fooditems/:id
exports.deleteFoodItem = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return next(new ErrorHandler('Food item not found', 404));
        }

        // Delete food item images from Cloudinary
        if (foodItem.images && foodItem.images.length > 0) {
            const { deleteFromCloudinary } = require('../utils/cloudinary');
            for (const image of foodItem.images) {
                if (image.public_id) {
                    await deleteFromCloudinary(image.public_id);
                }
            }
        }

        await FoodItem.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Food item deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to delete food item', 500));
    }
});
