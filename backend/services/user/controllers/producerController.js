const { Producer, Product } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');
const { documentValidator } = require('../../../shared/validators/documentValidator');

exports.addProduct = async (req, res) => {
    try {
        const requiredFields = ['name', 'price', 'quantity', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Campos obrigatórios faltando',
                missing_fields: missingFields,
                example: {
                    name: "Maçã",
                    price: 5.99,
                    quantity: 100,
                    category: "frutas"
                }
            });
        }

        if (req.body.price <= 0) {
            return res.status(400).json({
                error: 'Preço inválido',
                min_value: 0.01
            });
        }

        const producer = await Producer.findOne({
            where: { user_id: req.user.id },
            attributes: ['id', 'active']
        });

        if (!producer) {
            return res.status(403).json({
                error: 'Acesso negado',
                solution: 'Complete seu cadastro como produtor primeiro'
            });
        }

        if (!producer.active) {
            return res.status(403).json({
                error: 'Conta de produtor inativa',
                solution: 'Ative sua conta nas configurações'
            });
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

        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Falha ao cadastrar produto',
            recovery: 'Verifique os dados ou tente novamente mais tarde'
        });
    }
};

exports.updateProducerConfig = async (req, res) => {
    try {
        const allowedFields = ['cpf_cnpj', 'certificado_id'];
        const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                error: 'Campos inválidos para atualização',
                invalid_fields: invalidFields,
                allowed_fields: allowedFields
            });
        }

        if (req.body.cpf_cnpj && !documentValidator(req.body.cpf_cnpj)) {
            return res.status(400).json({
                error: 'Documento inválido',
                valid_formats: ['CPF (999.999.999-99) ou CNPJ (99.999.999/9999-99)']
            });
        }

        const [updatedCount] = await Producer.update(req.body, {
            where: { user_id: req.user.id },
            individualHooks: true
        });

        if (updatedCount === 0) {
            return res.status(404).json({
                error: 'Perfil de produtor não encontrado',
                solution: 'Complete seu cadastro como produtor primeiro'
            });
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

        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({
            error: message || 'Falha na atualização das configurações',
            troubleshooting: 'Verifique os dados ou contate o suporte'
        });
    }
};

// validação de certificado