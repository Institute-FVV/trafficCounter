const { database } = require('../database')
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')

const saltRounds = 10;

// define model for a use case
// use case is a concret measurement tasks and defines the buttons for this type of measurment
// additionally the use case is protected by a secure pin code
let UseCase = database.define('useCase', {
  name: Sequelize.STRING,
  measurementOptions: Sequelize.JSON,
  pinCode: Sequelize.STRING
})

// static class function to convert frontend numerical pin to hash
UseCase.generateHash = function(pinCode) {
  return bcrypt.hashSync(pinCode, 10)
}

// instance method to verify a numerical pin to the original hash
UseCase.prototype.validPinCode = function(pinCode) {
  return bcrypt.compareSync(pinCode, this.pinCode);
}

exports.UseCase = UseCase