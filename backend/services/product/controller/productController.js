const { Product } = require('../models/Product');

exports.listByCategory = async (req, res, next) => {
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
        error.clientMessage = 'Falha ao listar produtos';
        error.statusCode = 500;
        error.type = 'database_error';
        next(error);
    }
};

exports.updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 0) {
            const error = new Error('Quantidade inválida');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Quantidade inválida';
            error.details = {
                minValue: 0,
                example: { quantity: 50 }
            };
            return next(error);
        }

        const product = await Product.findByPk(id);

        if (!product) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Produto não encontrado';
            return next(error);
        }

        if (product.producerId !== req.producer.id) {
            const error = new Error('Acesso negado');
            error.statusCode = 403;
            error.type = 'forbidden';
            error.clientMessage = 'Você não é o produtor deste item';
            error.details = 'Acesso negado: Você não é o produtor deste item';
            return next(error);
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

        error.clientMessage = 'Falha ao atualizar estoque';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'database_error';
        next(error);
    }
};