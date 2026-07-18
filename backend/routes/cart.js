const express = require('express');
const router = express.Router();

const {
    addItemToCart,
    getUserCart,
    removeItemFromCart
} = require('../controllers/cartController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/add').post(isAuthenticatedUser, addItemToCart);
router.route('/').get(isAuthenticatedUser, getUserCart);
router.route('/remove/:id').delete(isAuthenticatedUser, removeItemFromCart);

module.exports = router;
