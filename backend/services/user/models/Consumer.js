const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/sequelize');
const User = require('./User');

const Consumer = sequelize.define('Consumer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    }
});

User.hasOne(Consumer, { foreignKey: 'id' });
Consumer.belongsTo(User, { foreignKey: 'id' });

module.exports = Consumer;