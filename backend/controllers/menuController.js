const Menu = require('../models/menu');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get menus by restaurant   =>   /api/v1/menus/:restaurantId
exports.getMenusByRestaurant = catchAsyncErrors(async (req, res, next) => {
    const menus = await Menu.find({ restaurant: req.params.restaurantId });

    res.status(200).json({
        success: true,
        count: menus.length,
        menus
    });
});

// Create new menu   =>   /api/v1/admin/menu/new
exports.newMenu = catchAsyncErrors(async (req, res, next) => {
    const menu = await Menu.create(req.body);

    res.status(201).json({
        success: true,
        menu
    });
});
