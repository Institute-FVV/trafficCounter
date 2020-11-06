const Sequelize = require('sequelize');

// reset the automatic conversion of pg and work with the timezones
var pg = require('pg');
pg.types.setTypeParser(1082, 'text', function(text) {return text;});
pg.types.setTypeParser(1184, 'text', function(text) {return text;});
pg.types.setTypeParser(1114, 'text', function(text) {return text;});

exports.database = new Sequelize({
    dialect: 'postgres',
    database: 'fvv_counter',
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    host: process.env.PGHOST || '/var/run/postgresql',
    port: process.env.PGPORT || 5432,
    timezone: 'Europe/Vienna',
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
          return next()
        },
    },
    logging: true,
    logQueryParameters: true
  });