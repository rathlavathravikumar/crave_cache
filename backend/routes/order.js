const express = require('express');
const router = express.Router();

const {
    newOrder,
    myOrders,
    getSingleOrder,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/:id/status').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.route('/orders/:id/cancel').put(isAuthenticatedUser, cancelOrder);

module.exports = router;
