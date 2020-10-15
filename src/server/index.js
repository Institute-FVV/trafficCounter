require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 3001;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const finale  = require('finale-rest');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const database = new Sequelize({
  dialect: 'postgres',
  database: 'trafficCounter',
  username: process.env.PGUSER || '',
  password: process.env.PGPASSWORD || '',
  host: process.env.PGHOST || '/var/run/postgresql',
  port: process.env.PGPORT || 5432,
});

finale.initialize({ 
  app: app,
  base: '/api',
  sequelize: database 
});

const Street = database.define('streets', {
  streetName: Sequelize.STRING,
  amountOptions: Sequelize.INTEGER
});

finale.resource({
  model: Street,
  endpoints: ['/streets', '/streets/:id'],
});

database
  .sync( {force: true })
  .then(() => {
    app.listen(port, () => {
     console.log(`Listening on port ${port}`);
  });
});