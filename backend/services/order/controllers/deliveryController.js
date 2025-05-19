const { Delivery } = require('../models/Delivery');

exports.createDelivery = async (req, res, next) => {
    try {
        const { orderId, estimatedDate } = req.body;

        const delivery = await Delivery.create({
            orderId,
            status: 'preparando',
            estimatedDate
        });

        res.status(201).json({
            message: 'Entrega registrada',
            deliveryId: delivery.id,
            estimatedDate: delivery.estimatedDate
        });

    } catch (error) {
        console.error('Erro ao criar entrega:', error.stack);
        error.clientMessage = 'Falha no registro da entrega';
        error.statusCode = 500;
        error.type = 'delivery_creation_error';
        error.details = {
            recovery: 'Verifique os dados do pedido e tente novamente'
        };
        next(error);
    }
};

exports.updateDeliveryStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['preparando', 'enviado', 'entregue'];

        if (!validStatuses.includes(status)) {
            const error = new Error('Status inválido');
            error.statusCode = 400;
            error.type = 'invalid_input';
            error.clientMessage = 'Status de entrega não reconhecido';
            error.details = { validStatuses };
            return next(error);
        }

        const [updated] = await Delivery.update(
            { status },
            { where: { id: req.params.id } }
        );

        if (!updated) {
            const error = new Error('Entrega não encontrada');
            error.statusCode = 404;
            error.type = 'not_found';
            error.clientMessage = 'Registro de entrega não localizado';
            return next(error);
        }

        res.json({
            message: 'Status atualizado',
            newStatus: status
        });

    } catch (error) {
        console.error('Erro ao atualizar entrega:', {
            deliveryId: req.params.id,
            error: error.stack
        });
        error.clientMessage = 'Falha na atualização do status';
        error.statusCode = error.statusCode || 500;
        error.type = error.type || 'delivery_status_error';
        next(error);
    }
};