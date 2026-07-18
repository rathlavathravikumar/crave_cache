const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['order_confirmed', 'order_preparing', 'order_ready', 'order_out_for_delivery', 'order_delivered', 'promotion', 'restaurant_alert', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedEntity: {
        entityType: String, // 'order', 'restaurant', 'promotion'
        entityId: mongoose.Schema.ObjectId
    },
    actionUrl: String,
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    icon: String,
    imageUrl: String,
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
    },
    sentAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
}, {
    timestamps: true
});

// TTL Index - auto-delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
