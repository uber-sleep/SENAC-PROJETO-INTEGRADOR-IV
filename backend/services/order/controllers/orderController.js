const { Order, OrderItem, Product, Consumer } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');

exports.createOrder = async (req, res) => {
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha ao criar pedido' });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
        if (product.stockQuantity < quantity) {
            return res.status(400).json({
                error: 'Estoque insuficiente',
                available: product.stockQuantity,
                requested: quantity
            });
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha crítica' });
    }
};

exports.calculateTotal = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId, {
            include: [{
                model: OrderItem,
                attributes: ['price', 'quantity']
            }]
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha no cálculo' });
    }
};

exports.listOrdersByConsumer = async (req, res) => {
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha na listagem' });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
        if (order.status !== 'pendente') {
            return res.status(400).json({
                error: 'Pedido não pode ser cancelado',
                currentStatus: order.status,
                allowedCancellation: 'Apenas pedidos com status "pendente"'
            });
        }

        await order.update({ status: 'cancelado' });
        res.json({ message: 'Pedido cancelado com sucesso' });

    } catch (error) {
        console.log('Erro ao cancelar pedido:', {
            orderId: req.params.id,
            error: error.stack
        });
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha no cancelamento' });
    }
};