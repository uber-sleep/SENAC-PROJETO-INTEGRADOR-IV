const { Delivery } = require('../models');
const { handleSequelizeError } = require('../../../shared/utils/sequelizeErrorHandler');

exports.createDelivery = async (req, res) => {
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha ao criar entrega' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['preparando', 'enviado', 'entregue'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Status inválido',
                validStatuses
            });
        }

        const [updated] = await Delivery.update(
            { status },
            { where: { id: req.params.id } }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
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
        const { status, message } = handleSequelizeError(error);
        res.status(status || 500).json({ error: message || 'Falha na atualização' });
    }
};