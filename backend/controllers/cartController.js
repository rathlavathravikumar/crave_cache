const Cart = require('../models/cart');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Add item to cart   =>   /api/v1/cart/add
exports.addItemToCart = catchAsyncErrors(async (req, res, next) => {
    const { foodItemId, quantity, restaurantId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user.id,
            restaurant: restaurantId,
            items: [{ foodItemId, quantity }]
        });
    } else {
        // If restaurant is different, clear cart and start new
        if (cart.restaurant.toString() !== restaurantId) {
            cart.restaurant = restaurantId;
            cart.items = [{ foodItemId, quantity }];
        } else {
            const isItemExist = cart.items.find(i => i.foodItemId.toString() === foodItemId);

            if (isItemExist) {
                cart.items.forEach(i => {
                    if (i.foodItemId.toString() === foodItemId) {
                        i.quantity = quantity;
                    }
                });
            } else {
                cart.items.push({ foodItemId, quantity });
            }
        }
        await cart.save();
    }

    res.status(200).json({
        success: true,
        cart
    });
});

// Get user cart   =>   /api/v1/cart
exports.getUserCart = catchAsyncErrors(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.foodItemId');

    res.status(200).json({
        success: true,
        cart
    });
});

// Remove item from cart   =>   /api/v1/cart/remove/:id
exports.removeItemFromCart = catchAsyncErrors(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return next(new ErrorHandler('Cart not found', 404));
    }

    cart.items = cart.items.filter(i => i.foodItemId.toString() !== req.params.id);

    await cart.save();

    res.status(200).json({
        success: true,
        cart
    });
});
