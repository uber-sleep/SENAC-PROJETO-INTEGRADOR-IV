require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'segredo_fallback_para_dev',
    expiresIn: '24h',
    algorithm: 'HS256',
};