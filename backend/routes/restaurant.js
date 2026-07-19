const express = require('express');
const router = express.Router();

const {
    getRestaurants,
    getSingleRestaurant,
    newRestaurant,
    uploadRestaurantImage
} = require('../controllers/restaurantController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/').get(getRestaurants);
router.route('/:id').get(getSingleRestaurant);

router.route('/admin/new').post(isAuthenticatedUser, authorizeRoles('admin'), newRestaurant);
router.route('/admin/:id/image').post(isAuthenticatedUser, authorizeRoles('admin'), upload.single('image'), uploadRestaurantImage);

module.exports = router;
