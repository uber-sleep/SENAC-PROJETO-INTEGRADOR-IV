const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
router.get(
    '/:id',
    [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
    userController.getUserById
);

router.put(
    '/:id',
    [
        authMiddleware,
        param('id').isInt().withMessage('ID inválido'),
        body('name').optional().trim().isLength({ min: 2 }),
        body('phone').optional().isString(),
        body('address').optional().isString(),
    ],
    userController.updateUser
);

router.delete(
    '/:id',
    [authMiddleware, param('id').isInt().withMessage('ID inválido')],
    userController.deleteUser
);

module.exports = router;