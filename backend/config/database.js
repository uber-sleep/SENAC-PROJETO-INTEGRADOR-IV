require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

const servicesDir = path.join(__dirname, "../services");

const readModels = (dir) => {
  fs.readdirSync(dir).forEach((item) => {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      readModels(itemPath);
    } else if (item.endsWith(".js") && itemPath.includes("/models/")) {
      const model = require(itemPath);
      if (typeof model === "function") {
        model(sequelize, Sequelize.DataTypes);
      }
    }
  });
};

readModels(servicesDir);

Object.values(sequelize.models).forEach((model) => model.associate?.());

module.exports = sequelize;
