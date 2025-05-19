const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const consumerController = require('../controllers/consumerController');

router.get(
    '/nearby-producers',
    [
        query('latitude').optional().isFloat({ min: -90, max: 90 }),
        query('longitude').optional().isFloat({ min: -180, max: 180 }),
        query('radius').optional().isInt({ min: 1, max: 100 }),
    ],
    consumerController.findNearbyProducers
);

module.exports = router;