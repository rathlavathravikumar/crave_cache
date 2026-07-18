const express = require('express');
const router = express.Router();

const {
    createReview,
    getRestaurantReviews,
    getFoodItemReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    markHelpful
} = require('../controllers/reviewController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Create new review
router.route('/new').post(isAuthenticatedUser, createReview);

// Get reviews by restaurant
router.route('/restaurant/:restaurantId').get(getRestaurantReviews);

// Get reviews by food item
router.route('/fooditem/:foodItemId').get(getFoodItemReviews);

// Get single review
router.route('/:id').get(getSingleReview);

// Update and delete review
router.route('/:id')
    .put(isAuthenticatedUser, updateReview)
    .delete(isAuthenticatedUser, deleteReview);

// Mark review as helpful
router.route('/:id/helpful').post(isAuthenticatedUser, markHelpful);

module.exports = router;
