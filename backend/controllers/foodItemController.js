const FoodItem = require('../models/foodItem');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const connectDatabase = require('../config/db');
const { isDatabaseReady, fallbackFoodItems } = require('../utils/fallbackData');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.getFoodItemsByMenu = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // continue with fallback data if the database is unavailable
        }
    }

    if (!isDatabaseReady()) {
        return res.status(200).json({ success: true, count: fallbackFoodItems.length, foodItems: fallbackFoodItems });
    }

    const foodItems = await FoodItem.find({ menu: req.params.menuId }).populate('restaurant').populate('menu');

    res.status(200).json({
        success: true,
        count: foodItems.length,
        foodItems
    });
});

exports.getAllFoodItems = catchAsyncErrors(async (req, res, next) => {
    console.log('getAllFoodItems called - dbReady:', isDatabaseReady());
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            console.log('connectDatabase failed in foodItem handler:', error && error.message);
            // continue with fallback data if the database is unavailable
        }
    }

    if (!isDatabaseReady()) {
        console.log('Using fallback food items');
        return res.status(200).json({ success: true, count: fallbackFoodItems.length, foodItems: fallbackFoodItems });
    }

    const foodItems = await FoodItem.find().populate('restaurant').populate('menu');

    // If database is empty, use fallback data
    if (foodItems.length === 0) {
        console.log('Database is empty, using fallback food items');
        return res.status(200).json({ success: true, count: fallbackFoodItems.length, foodItems: fallbackFoodItems });
    }

    res.status(200).json({
        success: true,
        count: foodItems.length,
        foodItems
    });
});

// Get single food item details   =>   /api/v1/fooditem/:id
exports.getSingleFoodItem = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // ignore and use the normal database query below
        }
    }

    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
        return next(new ErrorHandler('Food item not found', 404));
    }

    res.status(200).json({
        success: true,
        foodItem
    });
});

// Create new food item   =>   /api/v1/admin/fooditem/new
exports.newFoodItem = catchAsyncErrors(async (req, res, next) => {
    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // ignore and let the create attempt fail normally if the database is unavailable
        }
    }

    const foodItem = await FoodItem.create(req.body);

    res.status(201).json({
        success: true,
        foodItem
    });
});

// Upload food item image => /api/v1/admin/fooditem/:id/image
exports.uploadFoodItemImage = catchAsyncErrors(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler('Please upload an image file', 400));
    }

    if (!isDatabaseReady()) {
        try {
            await connectDatabase();
        } catch (error) {
            // fall through to error handling
        }
    }

    try {
        const foodItemId = req.params.id;
        
        // Convert buffer to base64 for Cloudinary
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Upload to Cloudinary
        const imageData = await uploadToCloudinary(base64Image, 'food-items');

        const foodItem = await FoodItem.findById(foodItemId);
        if (!foodItem) {
            return next(new ErrorHandler('Food item not found', 404));
        }

        // Delete old image if it exists
        if (foodItem.images?.[0]?.public_id) {
            await deleteFromCloudinary(foodItem.images[0].public_id);
        }

        foodItem.images = [imageData];
        await foodItem.save();

        res.status(200).json({ success: true, foodItem });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to upload food item image', 500));
    }
});
