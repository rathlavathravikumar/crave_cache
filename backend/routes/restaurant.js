const express = require('express');
const router = express.Router();

const {
    getRestaurants,
    getSingleRestaurant,
    newRestaurant
} = require('../controllers/restaurantController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/').get(getRestaurants);
router.route('/:id').get(getSingleRestaurant);

router.route('/admin/new').post(isAuthenticatedUser, authorizeRoles('admin'), newRestaurant);

module.exports = router;
