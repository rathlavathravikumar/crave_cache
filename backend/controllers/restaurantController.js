const Restaurant = require('../models/restaurant');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const connectDatabase = require('../config/db');
const { isDatabaseReady, fallbackRestaurants } = require('../utils/fallbackData');

exports.getRestaurants = catchAsyncErrors(async (req, res, next) => {
    console.log('getRestaurants called - dbReady:', isDatabaseReady());
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            console.log('connectDatabase failed in handler:', error && error.message);
            // continue with fallback data if the database is unavailable
        }
    }

    if (!isDatabaseReady()) {
        console.log('Using fallback restaurants');
        return res.status(200).json({ success: true, count: fallbackRestaurants.length, restaurants: fallbackRestaurants });
    }

    console.log('Querying Restaurant.find()');
    const restaurants = await Restaurant.find().sort({ rating: -1 }).lean();
    console.log('Query completed, found', restaurants.length);
    
    // If database is empty, use fallback data
    if (restaurants.length === 0) {
        console.log('Database is empty, using fallback restaurants');
        return res.status(200).json({ success: true, count: fallbackRestaurants.length, restaurants: fallbackRestaurants });
    }

    res.status(200).json({
        success: true,
        count: restaurants.length,
        restaurants
    });
});

// Get single restaurant details   =>   /api/v1/restaurant/:id
exports.getSingleRestaurant = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // ignore and use the normal database query below
        }
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorHandler('Restaurant not found', 404));
    }

    res.status(200).json({
        success: true,
        restaurant
    });
});

// Create new restaurant   =>   /api/v1/admin/restaurant/new
exports.newRestaurant = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // ignore and let the create attempt fail normally if the database is unavailable
        }
    }

    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
        success: true,
        restaurant
    });
});
