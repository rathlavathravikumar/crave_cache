const express = require('express');
const router = express.Router();

const {
    processPayment,
    stripeWebhook
} = require('../controllers/paymentController');

const { isAuthenticatedUser } = require('../middlewares/auth');

// Webhook route - must be before body parser (should be registered in app.js with raw body)
router.route('/webhook').post(stripeWebhook);

// Regular payment routes
router.route('/process').post(isAuthenticatedUser, processPayment);

module.exports = router;
