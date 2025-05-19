const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
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
    certificate_id: {
        type: DataTypes.STRING
    }
});

User.hasOne(Producer, { foreignKey: 'id' });
Producer.belongsTo(User, { foreignKey: 'id' });

module.exports = Producer;