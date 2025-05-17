const { Product } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');

exports.listByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, pageSize = 20 } = req.query;

        const products = await Product.findAndCountAll({
            where: { category },
            limit: parseInt(pageSize),
            offset: (page - 1) * pageSize,
            order: [['price', 'ASC']]
        });

        if (products.count === 0) {
            return res.status(200).json({
                message: 'Nenhum produto encontrado nesta categoria',
                suggestion: 'Verifique a ortografia ou explore outras categorias'
            });
        }

        res.json({
            category,
            page,
            totalItems: products.count,
            results: products.rows
        });

    } catch (error) {
        console.log('Erro ao listar produtos:', { error: error.stack });
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Erro na busca' });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({
                error: 'Quantidade inválida',
                minValue: 0,
                example: { quantity: 50 }
            });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        if (product.producerId !== req.producer.id) {
            return res.status(403).json({
                error: 'Acesso negado',
                details: 'Você não é o produtor deste item'
            });
        }

        product.quantity = quantity;
        await product.save();

        return res.json({
            message: 'Estoque atualizado com sucesso',
            product: {
                id: product.id,
                name: product.name,
                quantity: product.quantity
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar estoque:', {
            productId: req.params.id,
            error: error.stack
        });

        const { status, message } = handleSequelizeError(error);
        return res.status(status || 500).json({
            error: message || 'Falha crítica no sistema'
        });
    }
};