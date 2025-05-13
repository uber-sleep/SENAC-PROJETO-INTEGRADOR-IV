const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/sequelize');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateTime: DataTypes.DATE,
    status: DataTypes.ENUM('pendente', 'pago', 'cancelado'),
    total: DataTypes.FLOAT,
    transactionId: DataTypes.STRING,
    consumerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Consumers',             
            key: 'id'
        }
    }
});

module.exports = Order;