const Sequelize = require('sequelize');
const { database } = require('../database')
const { UseCase } = require('./useCase')

// define a model for a concret measurement
// a measurement is a click on the button defined within a usecase
// therefore the measurement is related with the corresponding usecase
// the measurement value is given by the button value
// the timestamp is defined by the frontend on button press
let Measurement = database.define('measurement', {
    groupName: Sequelize.STRING,
    value: Sequelize.STRING,
    timestamp: Sequelize.DATE,
  })

UseCase.hasMany(Measurement); 

exports.Measurement = Measurement