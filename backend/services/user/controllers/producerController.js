const { Producer } = require('../models/Producer');
const { Product } = require('../../product/models/Product');
const { documentValidator } = require('../../../utils/documentValidator');

exports.addProduct = async (req, res, next) => {
    try {
        const requiredFields = ['name', 'price', 'quantity', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            const error = new Error('Campos obrigatórios faltando');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Dados incompletos para cadastro';
            error.details = {
                missing_fields: missingFields,
                example: {
                    name: "Maçã",
                    price: 5.99,
                    quantity: 100,
                    category: "frutas"
                }
            };
            return next(error);
        }

        if (req.body.price <= 0) {
            const error = new Error('Preço inválido');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Valor do produto inválido';
            error.details = { min_value: 0.01 };
            return next(error);
        }

        const producer = await Producer.findOne({
            where: { user_id: req.user.id },
            attributes: ['id', 'active']
        });

        if (!producer) {
            const error = new Error('Acesso negado');
            error.statusCode = 403;
            error.type = 'forbidden';
            error.clientMessage = 'Complete seu cadastro como produtor primeiro';
            return next(error);
        }

        if (!producer.active) {
            const error = new Error('Conta de produtor inativa');
            error.statusCode = 403;
            error.type = 'inactive_account';
            error.clientMessage = 'Ative sua conta nas configurações';
            return next(error);
        }

        const product = await Product.create({
            ...req.body,
            producer_id: producer.id
        });

        const { producer_id, updatedAt, ...safeProduct } = product.toJSON();

        res.status(201).json({
            message: 'Produto cadastrado com sucesso',
            product: safeProduct
        });

    } catch (error) {
        console.error('Erro ao adicionar produto:', {
            user: req.user?.id,
            error: error.stack
        });

        error.clientMessage = 'Falha ao cadastrar produto';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'database_error';
        error.details = { recovery: 'Verifique os dados ou tente novamente mais tarde' };
        next(error);
    }
};

exports.updateProducerConfig = async (req, res, next) => {
    try {
        const allowedFields = ['cpf_cnpj', 'certificado_id'];
        const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            const error = new Error('Campos inválidos para atualização');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Campos não permitidos para atualização';
            error.details = {
                invalid_fields: invalidFields,
                allowed_fields: allowedFields
            };
            return next(error);
        }

        if (req.body.cpf_cnpj && !documentValidator(req.body.cpf_cnpj)) {
            const error = new Error('Documento inválido');
            error.statusCode = 400;
            error.type = 'invalid_document';
            error.clientMessage = 'Formato de documento inválido';
            error.details = {
                valid_formats: ['CPF (999.999.999-99) ou CNPJ (99.999.999/9999-99)']
            };
            return next(error);
        }

        const [updatedCount] = await Producer.update(req.body, {
            where: { user_id: req.user.id },
            individualHooks: true
        });

        if (updatedCount === 0) {
            const error = new Error('Perfil de produtor não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Complete seu cadastro como produtor primeiro';
            return next(error);
        }

        const updatedProducer = await Producer.findOne({
            where: { user_id: req.user.id },
            attributes: ['cpf_cnpj', 'certificado_id', 'updatedAt']
        });

        res.json({
            message: 'Configurações atualizadas com sucesso',
            changes: updatedProducer
        });

    } catch (error) {
        console.error('Erro na atualização do produtor:', {
            user: req.user?.id,
            error: error.stack
        });

        error.clientMessage = 'Falha na atualização das configurações';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'database_error';
        error.details = { troubleshooting: 'Verifique os dados ou contate o suporte' };
        next(error);
    }
};