const express = require('express');
const router = express.Router();

const {
    getFoodItemsByMenu,
    getSingleFoodItem,
    newFoodItem,
    getAllFoodItems
} = require('../controllers/foodItemController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/').get(getAllFoodItems);
router.route('/:menuId').get(getFoodItemsByMenu);
router.route('/item/:id').get(getSingleFoodItem);

router.route('/admin/new').post(isAuthenticatedUser, authorizeRoles('admin'), newFoodItem);

module.exports = router;
