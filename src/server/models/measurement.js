const Sequelize = require('sequelize');
const { database } = require('../database')

// define a model for a concret measurement
// a measurement is a click on the button defined within a usecase
// therefore the measurement is related with the corresponding usecase
// the measurement value is given by the button value
// through sequalize the createdDate is added, which is taken as measurement time
exports.Measurement = database.define('measurement', {
    useCase: Sequelize.INTEGER,
    groupName: Sequelize.STRING,
    value: Sequelize.STRING
  });