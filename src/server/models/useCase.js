const { database } = require('../database')
const Sequelize = require('sequelize');

exports.UseCase = database.define('useCase', {
    name: Sequelize.STRING,
    measurementOptions: Sequelize.JSON
  });