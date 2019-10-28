'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);

const Models = {};
const basename = path.basename(__filename);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    const modelName = model.name.split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    Models[modelName] = model;
  });

Object.keys(Models).forEach(modelName => {
  if (Models[modelName].associate) {
    Models[modelName].associate(Models);
  }
});

const connection = {};

module.exports = async () => {
  if (connection.isConnected) {
    console.log('Using existing connection');
    return Models;
  }

  await sequelize.authenticate();
  connection.isConnected = true;
  console.log('Created a new connection');
  return Models;
}