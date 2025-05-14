const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/sequelize');
const User = require('./User');

const Producer = sequelize.define('Producer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    cpf_cnpj: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    certificate_id: {
        type: DataTypes.STRING
    }
});

User.hasOne(Producer, { foreignKey: 'id' });
Producer.belongsTo(User, { foreignKey: 'id' });

module.exports = Producer;