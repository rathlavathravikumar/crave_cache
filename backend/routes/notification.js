const express = require('express');
const router = express.Router();

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require('../controllers/notificationController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/').get(isAuthenticatedUser, getMyNotifications);
router.route('/:id/read').put(isAuthenticatedUser, markNotificationAsRead);
router.route('/read-all').put(isAuthenticatedUser, markAllNotificationsAsRead);

module.exports = router;
