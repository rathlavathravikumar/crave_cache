const express = require('express');
const router = express.Router();

const {
    getMenusByRestaurant,
    newMenu
} = require('../controllers/menuController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/menus/:restaurantId').get(getMenusByRestaurant);

router.route('/admin/menu/new').post(isAuthenticatedUser, authorizeRoles('admin'), newMenu);

module.exports = router;
