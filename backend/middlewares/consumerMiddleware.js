const { Consumer } = require('../services/user/models/Consumer');

module.exports = async (req, res, next) => {
    try {
        const consumer = await Consumer.findOne({
            where: { id: req.user.id } 
        });

        if (!consumer) {
            return res.status(403).json({
                error: 'Acesso restrito a consumidores',
                solution: 'Complete seu cadastro como consumidor'
            });
        }

        req.consumer = consumer; 
        next();
    } catch (error) {
        console.error('Erro no middleware de consumidor:', error);
        res.status(500).json({ error: 'Falha ao verificar permissões' });
    }
};