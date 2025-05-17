require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'mysql', 
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const modelsDir = path.join(__dirname, '../models');
fs.readdirSync(modelsDir)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const model = require(path.join(modelsDir, file));
        if (model.initialize) model.initialize(sequelize);
    });

Object.values(sequelize.models)
    .forEach(model => model.associate?.());

module.exports = sequelize;