const express = require('express');
const router = express.Router();
const { param, body, query } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const producerMiddleware = require('../../producer/middlewares/producerMiddleware');

router.get(
    '/category/:category',
    [
        param('category').notEmpty().trim(),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt()
    ],
    productController.listByCategory
);

router.patch(
    '/:id/stock',
    [
        authMiddleware,
        producerMiddleware,
        param('id').isInt({ min: 1 }).toInt(),
        body('quantity').isInt({ min: 0 }).toInt()
    ],
    productController.updateStock
);

module.exports = router;