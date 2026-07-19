const express = require('express');
const router = express.Router();

const { validateCoupon } = require('../controllers/couponController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/validate').post(isAuthenticatedUser, validateCoupon);

module.exports = router;
