const express = require('express');
const router = express.Router();

const {
    generateDescription,
    analyzeReview,
    recommendFood,
    searchFood
} = require('../controllers/aiController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/generate-description').post(isAuthenticatedUser, authorizeRoles('admin'), generateDescription);
router.route('/analyze-review').post(isAuthenticatedUser, analyzeReview);
router.route('/recommend').post(isAuthenticatedUser, recommendFood);
router.route('/search').post(isAuthenticatedUser, searchFood);

module.exports = router;
