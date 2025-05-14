const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/sequelize');

const Delivery = sequelize.define('Delivery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: DataTypes.ENUM('preparando', 'enviado', 'entregue'),
    estimatedDate: DataTypes.DATE,
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders', 
            key: 'id'
        }
    }
});

module.exports = Delivery;