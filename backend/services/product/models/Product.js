const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/sequelize');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stockQuantity: DataTypes.INTEGER,
    category: DataTypes.STRING,
    imageUtf: DataTypes.STRING,
    producerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Producers', 
            key: 'id'
        }
    }
});

module.exports = Product;