const { Order } = require('../../models');

const orderOwnershipMiddleware = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.params.orderId || req.params.id,
                consumerId: req.consumer.id
            }
        });

        if (!order) {
            return res.status(403).json({
                error: 'Acesso negado',
                details: 'Você não tem permissão para acessar este pedido'
            });
        }

        next();
    } catch (error) {
        console.error('Erro na verificação de dono do pedido:', error);
        res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
};

module.exports = orderOwnershipMiddleware;