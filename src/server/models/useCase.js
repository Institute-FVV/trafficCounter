const { database } = require('../database')
const Sequelize = require('sequelize');

// define model for a use case
// use case is a concret measurement tasks and defines the buttons for this type of measurment
exports.UseCase = database.define('useCase', {
    name: Sequelize.STRING,
    measurementOptions: Sequelize.JSON
  });