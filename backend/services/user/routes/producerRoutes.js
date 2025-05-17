const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const producerController = require('../controllers/producerController');
const authMiddleware = require('../../../middlewares/authMiddleware');
const producerMiddleware = require('../middlewares/producerMiddleware');
const { validateDocument } = require('../../../shared/utils/documentValidator');

router.use(authMiddleware, producerMiddleware);

const productValidation = [
    body('name').notEmpty().trim(),
    body('price').isFloat({ min: 0.01 }),
    body('quantity').isInt({ min: 1 }),
    body('category').notEmpty()
];

const configValidation = [
    body('cpf_cnpj').optional().custom(validateDocument),
    body('certificate_id').optional().isString()
];

router.post('/products', productValidation, producerController.addProduct);
router.put('/config', configValidation, producerController.updateProducerConfig);

module.exports = router;