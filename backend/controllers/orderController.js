const Order = require('../models/order');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create new order   =>   /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        restaurant,
        orderItems,
        deliveryInfo,
        itemsPrice,
        taxPrice,
        deliveryPrice,
        totalPrice,
        paymentInfo,
        discountAmount,
        coupon
    } = req.body;

    const order = await Order.create({
        user: req.user._id,
        restaurant,
        orderItems,
        deliveryInfo,
        itemsPrice,
        taxPrice,
        deliveryPrice,
        discountAmount,
        coupon,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        orderStatus: 'Pending',
        statusHistory: [
            {
                status: 'Pending',
                timestamp: new Date(),
                notes: 'Order created successfully'
            }
        ]
    });

    res.status(200).json({
        success: true,
        order
    });
});

// Get currently logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    });
});

// Get single order details   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Check if user is the order owner or admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You are not authorized to view this order', 403));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Update order status   =>   /api/v1/orders/:id/status (Admin only)
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return next(new ErrorHandler('Please provide order status', 400));
    }

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'OutForDelivery', 'Delivered', 'Cancelled', 'Failed'];
    if (!validStatuses.includes(status)) {
        return next(new ErrorHandler(`Invalid status. Allowed: ${validStatuses.join(', ')}`, 400));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    order.orderStatus = status;

    // Update status history
    order.statusHistory.push({
        status: status,
        timestamp: new Date()
    });

    // Mark as delivered
    if (status === 'Delivered') {
        order.deliveredAt = new Date();
    }

    // Mark as cancelled
    if (status === 'Cancelled') {
        order.cancelledAt = new Date();
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order
    });
});

// Cancel order   =>   /api/v1/orders/:id/cancel
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You are not authorized to cancel this order', 403));
    }

    // Can't cancel if already delivered or cancelled
    if (['Delivered', 'Cancelled'].includes(order.orderStatus)) {
        return next(new ErrorHandler(`Cannot cancel order with status: ${order.orderStatus}`, 400));
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    
    // Add to status history
    order.statusHistory.push({
        status: 'Cancelled',
        timestamp: new Date()
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
    });
});
