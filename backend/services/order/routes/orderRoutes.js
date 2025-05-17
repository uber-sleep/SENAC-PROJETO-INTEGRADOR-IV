const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');

const orderController = require('../controllers/orderController');
const deliveryController = require('../controllers/deliveryController');

const authMiddleware = require('../../../middlewares/authMiddleware');
const consumerMiddleware = require('../../consumer/middlewares/consumerMiddleware');
const orderOwnershipMiddleware = require('../middlewares/orderOwnershipMiddleware');

router.post(
    '/',
    [
        authMiddleware,
        consumerMiddleware,
        body('consumerId').isInt({ min: 1 }).toInt()
    ],
    orderController.createOrder
);

router.post(
    '/:orderId/items',
    [
        authMiddleware,
        consumerMiddleware,
        orderOwnershipMiddleware,
        param('orderId').isInt({ min: 1 }).toInt(),
        body('productId').isInt({ min: 1 }).toInt(),
        body('quantity').isInt({ min: 1 }).toInt()
    ],
    orderController.addItem
);

router.get(
    '/:orderId/total',
    [
        authMiddleware,
        consumerMiddleware,
        orderOwnershipMiddleware,
        param('orderId').isInt({ min: 1 }).toInt()
    ],
    orderController.calculateTotal
);

router.get(
    '/consumer/:consumerId',
    [
        authMiddleware,
        consumerMiddleware,
        param('consumerId').isInt({ min: 1 }).toInt(),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt()
    ],
    orderController.listOrdersByConsumer
);

router.patch(
    '/:id/cancel',
    [
        authMiddleware,
        consumerMiddleware,
        orderOwnershipMiddleware,
        param('id').isInt({ min: 1 }).toInt()
    ],
    orderController.cancelOrder
);

router.post(
    '/deliveries',
    [
        authMiddleware,
        body('orderId').isInt({ min: 1 }).toInt(),
        body('estimatedDate').isISO8601().toDate()
    ],
    deliveryController.createDelivery
);

router.patch(
    '/deliveries/:id/status',
    [
        authMiddleware,
        param('id').isInt({ min: 1 }).toInt(),
        body('status').isIn(['preparando', 'enviado', 'entregue'])
    ],
    deliveryController.updateDeliveryStatus
);

module.exports = router;
