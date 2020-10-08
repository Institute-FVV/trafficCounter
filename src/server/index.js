require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const finale  = require('finale-rest');

const app = express();

app.use(cors());
app.use(bodyParser.json());


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

finale.initialize({ app, sequelize: database });

finale.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id'],
});

const port = process.env.SERVER_PORT || 3001;

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});