const express = require('express');
const router = express.Router();

const {
    getAdminStatistics,
    getAllOrders,
    updateOrderStatus,
    updateRestaurant,
    deleteRestaurant,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/adminController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/statistics').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminStatistics);
router.route('/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/orders/:id/status').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.route('/restaurants/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateRestaurant);
router.route('/restaurants/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteRestaurant);
router.route('/fooditems/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateFoodItem);
router.route('/fooditems/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteFoodItem);

module.exports = router;
