const Sequelize = require('sequelize');

exports.database = new Sequelize({
    dialect: 'postgres',
    database: 'fvv_counter',
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    host: process.env.PGHOST || '/var/run/postgresql',
    port: process.env.PGPORT || 5432,
  });