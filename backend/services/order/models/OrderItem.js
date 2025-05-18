const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const OrderItem = sequelize.define('OrderItem', {
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT,
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders', 
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products', 
            key: 'id'
        }
    }
});

module.exports = OrderItem;