const jwt = require('jsonwebtoken');
const { User } = require('../services/user/models/User'); 

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Erro no authMiddleware:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        res.status(500).json({ error: 'Falha na autenticação' });
    }
};