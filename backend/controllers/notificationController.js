const Notification = require('../models/notification');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.getMyNotifications = catchAsyncErrors(async (req, res, next) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);

    res.status(200).json({
        success: true,
        notifications
    });
});

exports.markNotificationAsRead = catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!notification) {
        return next(new ErrorHandler('Notification not found', 404));
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification
    });
});

exports.markAllNotificationsAsRead = catchAsyncErrors(async (req, res, next) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        {
            isRead: true,
            readAt: new Date()
        }
    );

    res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
    });
});
