require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 8080;
var path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const finale  = require('finale-rest');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
console.log(path.join(publicFolder, 'build'))
app.use(express.static(path.join(publicFolder, 'build')));

const database = new Sequelize({
  dialect: 'postgres',
  database: 'fvv_counter',
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

const UseCase = database.define('useCase', {
  name: Sequelize.STRING,
  measurementOptions: Sequelize.JSON
});

finale.resource({
  model: UseCase,
  endpoints: ['/useCases', '/useCases/:id'],
});

const Measurement = database.define('measurement', {
  useCase: Sequelize.STRING,
  value: Sequelize.STRING
});

finale.resource({
  model: Measurement,
  endpoints: ['/measurements', '/measurements/:id'],
  search: {
    param: 'useCaseId',
    attributes: ["useCase"]
  },
  pagination: false
});

database
  .sync( )
  .then(() => {
    app.listen(port, () => {
     console.log(`Listening on port ${port}`);
  });
});