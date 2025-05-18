const { Order } = require('../models/Order');
const { OrderItem } = require('../models/OrderItem');
const { Product } = require('../../product/models/Product');
const { Consumer } = require('../../user/models/Consumer');

exports.createOrder = async (req, res, next) => {
    try {
        const { consumerId } = req.body;

        const order = await Order.create({
            consumerId,
            status: 'pending',
            total: 0
        });

        res.status(201).json({
            message: 'Pedido iniciado',
            orderId: order.id,
            nextStep: `POST /orders/${order.id}/items`
        });

    } catch (error) {
        console.log('Erro ao criar pedido:', { error: error.stack });
        error.clientMessage = 'Falha ao iniciar novo pedido';
        error.statusCode = 500;
        error.type = 'order_creation_error';
        next(error);
    }
};

exports.addItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Produto indisponível no momento';
            return next(error);
        }

        if (product.stockQuantity < quantity) {
            const error = new Error('Estoque insuficiente');
            error.statusCode = 400;
            error.type = 'insufficient_stock';
            error.clientMessage = 'Quantidade solicitada indisponível';
            error.details = {
                available: product.stockQuantity,
                requested: quantity
            };
            return next(error);
        }

        await Product.update(
            { stockQuantity: product.stockQuantity - quantity },
            { where: { id: productId } }
        );

        const item = await OrderItem.create({
            orderId: req.params.orderId,
            productId,
            quantity,
            unitPrice: product.price
        });

        res.json({
            message: 'Item adicionado e estoque reservado',
            item: {
                id: item.id,
                product: product.name,
                reservedQuantity: quantity
            }
        });

    } catch (error) {
        console.log('Erro ao adicionar item:', {
            orderId: req.params.orderId,
            error: error.stack
        });
        error.clientMessage = 'Falha ao adicionar item ao pedido';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'order_item_error';
        next(error);
    }
};

exports.calculateTotal = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId, {
            include: [{
                model: OrderItem,
                attributes: ['price', 'quantity']
            }]
        });

        if (!order) {
            const error = new Error('Pedido não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Pedido não localizado';
            return next(error);
        }

        const total = order.OrderItems.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        );

        await order.update({ total });

        res.json({
            orderId: order.id,
            total: order.total.toFixed(2),
            itemsCount: order.OrderItems.length
        });

    } catch (error) {
        console.log('Erro ao calcular total:', {
            orderId: req.params.orderId,
            error: error.stack
        });
        error.clientMessage = 'Falha no cálculo do total';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'order_calculation_error';
        next(error);
    }
};

exports.listOrdersByConsumer = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { consumerId: req.params.consumerId },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                },
                {
                    model: Consumer,
                    attributes: ['id', 'address']
                }
            ],
            order: [['dateTime', 'DESC']]
        });

        res.json({
            count: orders.length,
            results: orders.map(order => ({
                id: order.id,
                status: order.status,
                total: order.total,
                items: order.OrderItems.map(item => ({
                    product: item.Product.name,
                    quantity: item.quantity
                }))
            }))
        });

    } catch (error) {
        console.log('Erro ao listar pedidos:', { error: error.stack });
        error.clientMessage = 'Falha na listagem de pedidos';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'order_list_error';
        next(error);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            const error = new Error('Pedido não encontrado');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Pedido não localizado';
            return next(error);
        }

        if (order.status !== 'pendente') {
            const error = new Error('Pedido não pode ser cancelado');
            error.statusCode = 400;
            error.type = 'invalid_operation';
            error.clientMessage = 'Status atual não permite cancelamento';
            error.details = {
                currentStatus: order.status,
                allowedCancellation: 'Apenas pedidos com status "pendente"'
            };
            return next(error);
        }

        await order.update({ status: 'cancelado' });
        res.json({ message: 'Pedido cancelado com sucesso' });

    } catch (error) {
        console.log('Erro ao cancelar pedido:', {
            orderId: req.params.id,
            error: error.stack
        });
        error.clientMessage = 'Falha no cancelamento do pedido';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'order_cancellation_error';
        next(error);
    }
};