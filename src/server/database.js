const Sequelize = require('sequelize');
const epilogue = require('epilogue');

const database = new Sequelize({
    dialect: 'postgres',
    database: 'trafficCounter',
    username: process.env.PGUSER || '',
    password: process.env.PGPASSWORD || '',
    host: process.env.PGHOST || '/var/run/postgresql',
    port: process.env.PGPORT || 5432,
});

const Post = database.define('posts', {
    title: Sequelize.STRING,
    body: Sequelize.TEXT,
  });

const initializeDatabase = async (app) => {
  epilogue.initialize({ app, sequelize: database });

  epilogue.resource({
    model: Post,
    endpoints: ['/posts', '/posts/:id'],
  });

  await database.sync();
};

module.exports = initializeDatabase;