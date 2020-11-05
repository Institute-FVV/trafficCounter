const { database } = require('../database')
const Sequelize = require('sequelize');

exports.Measurement = database.define('measurement', {
    useCase: Sequelize.INTEGER,
    groupName: Sequelize.STRING,
    value: Sequelize.STRING
  });