const Review = require('../models/review');
const Order = require('../models/order');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create new review   =>   /api/v1/reviews/new
exports.createReview = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId, foodItemId, orderId, rating, title, comment, images } = req.body;

    // Validate required fields
    if (!restaurantId || !rating || !title || !comment) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
        return next(new ErrorHandler('Rating must be between 1 and 5', 400));
    }

    // Check if user already reviewed this restaurant (if no specific order)
    if (!orderId) {
        const existingReview = await Review.findOne({
            user: req.user._id,
            restaurant: restaurantId,
            foodItem: foodItemId || null
        });

        if (existingReview) {
            return next(new ErrorHandler('You have already reviewed this item', 400));
        }
    }

    // If orderId provided, verify user owns the order
    if (orderId) {
        const order = await Order.findById(orderId);
        if (!order || order.user.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('Invalid order or unauthorized access', 403));
        }
    }

    // Determine sentiment based on AI or simple heuristic
    let sentiment = 'neutral';
    if (rating >= 4) {
        sentiment = 'positive';
    } else if (rating <= 2) {
        sentiment = 'negative';
    }

    const review = await Review.create({
        user: req.user._id,
        restaurant: restaurantId,
        foodItem: foodItemId,
        rating,
        title,
        comment,
        images: images || [],
        sentiment,
        isVerified: !!orderId // Mark as verified if from order
    });

    // Populate user info
    await review.populate('user', 'name avatar');

    res.status(201).json({
        success: true,
        message: 'Review created successfully',
        review
    });
});

// Get reviews for a restaurant   =>   /api/v1/reviews/restaurant/:restaurantId
exports.getRestaurantReviews = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ restaurant: restaurantId })
        .populate('user', 'name avatar')
        .populate('foodItem', 'name')
        .sort(sortBy)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Review.countDocuments({ restaurant: restaurantId });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
        { $match: { restaurant: require('mongoose').Types.ObjectId(restaurantId) } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    const stats = ratingStats[0] || { avgRating: 0, totalReviews: 0 };

    res.status(200).json({
        success: true,
        reviews,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        stats: {
            averageRating: Math.round(stats.avgRating * 10) / 10,
            totalReviews: stats.totalReviews
        }
    });
});

// Get reviews for a food item   =>   /api/v1/reviews/fooditem/:foodItemId
exports.getFoodItemReviews = catchAsyncErrors(async (req, res, next) => {
    const { foodItemId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ foodItem: foodItemId })
        .populate('user', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Review.countDocuments({ foodItem: foodItemId });

    res.status(200).json({
        success: true,
        reviews,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

// Get single review   =>   /api/v1/reviews/:id
exports.getSingleReview = catchAsyncErrors(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
        .populate('user', 'name avatar email')
        .populate('restaurant', 'name')
        .populate('foodItem', 'name');

    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }

    res.status(200).json({
        success: true,
        review
    });
});

// Update review   =>   /api/v1/reviews/:id
exports.updateReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, title, comment, images } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('You are not authorized to update this review', 403));
    }

    // Update fields
    if (rating) {
        if (rating < 1 || rating > 5) {
            return next(new ErrorHandler('Rating must be between 1 and 5', 400));
        }
        review.rating = rating;

        // Update sentiment
        if (rating >= 4) {
            review.sentiment = 'positive';
        } else if (rating <= 2) {
            review.sentiment = 'negative';
        } else {
            review.sentiment = 'neutral';
        }
    }

    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();

    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review
    });
});

// Delete review   =>   /api/v1/reviews/:id
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('You are not authorized to delete this review', 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
    });
});

// Mark review as helpful   =>   /api/v1/reviews/:id/helpful
exports.markHelpful = catchAsyncErrors(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        { $inc: { helpful: 1 } },
        { new: true }
    );

    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Review marked as helpful',
        review
    });
});
