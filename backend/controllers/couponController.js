const Coupon = require('../models/coupon');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { calculateDiscount } = require('../utils/validators');

exports.validateCoupon = catchAsyncErrors(async (req, res, next) => {
    const { code, cartTotal = 0, restaurantId, cartItems = [] } = req.body;

    if (!code || !code.trim()) {
        return next(new ErrorHandler('Please provide a coupon code', 400));
    }

    const normalizedCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
        return next(new ErrorHandler('Invalid coupon code', 400));
    }

    const now = new Date();
    if (!coupon.isActive || now < coupon.startDate || now > coupon.endDate) {
        return next(new ErrorHandler('Coupon is not available right now', 400));
    }

    if (coupon.maxUsageCount !== null && coupon.usageCount >= coupon.maxUsageCount) {
        return next(new ErrorHandler('Coupon has reached its usage limit', 400));
    }

    if (coupon.minOrderValue > cartTotal) {
        return next(new ErrorHandler(`Minimum order value of ₹${coupon.minOrderValue} is required for this coupon`, 400));
    }

    if (restaurantId && coupon.applicableRestaurants && coupon.applicableRestaurants.length > 0) {
        const restaurantMatch = coupon.applicableRestaurants.some((id) => id.toString() === restaurantId.toString());
        if (!restaurantMatch) {
            return next(new ErrorHandler('This coupon is not valid for the selected restaurant', 400));
        }
    }

    if (cartItems.length > 0 && coupon.applicableFoodItems && coupon.applicableFoodItems.length > 0) {
        const cartFoodItemIds = cartItems.map((itemId) => itemId.toString());
        const hasApplicableItem = coupon.applicableFoodItems.some((itemId) => cartFoodItemIds.includes(itemId.toString()));

        if (!hasApplicableItem) {
            return next(new ErrorHandler('This coupon is not valid for the items in your cart', 400));
        }
    }

    let discountAmount = calculateDiscount(cartTotal, coupon);

    if (coupon.discountType === 'free_delivery') {
        discountAmount = 50;
    }

    res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        discountAmount,
        coupon: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxDiscountAmount: coupon.maxDiscountAmount
        }
    });
});
