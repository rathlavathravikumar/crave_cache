const express = require('express');
const router = express.Router();

const {
    getFoodItemsByMenu,
    getSingleFoodItem,
    newFoodItem,
    getAllFoodItems,
    uploadFoodItemImage
} = require('../controllers/foodItemController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/').get(getAllFoodItems);
router.route('/:menuId').get(getFoodItemsByMenu);
router.route('/item/:id').get(getSingleFoodItem);

router.route('/admin/new').post(isAuthenticatedUser, authorizeRoles('admin'), newFoodItem);
router.route('/admin/:id/image').post(isAuthenticatedUser, authorizeRoles('admin'), upload.single('image'), uploadFoodItemImage);

module.exports = router;
