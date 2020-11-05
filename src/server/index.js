require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 8080;
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const finale  = require('finale-rest');
const app = express();
const { database } = require('./database')
const { UseCase } = require('./models/useCase')
const { Measurement } = require('./models/measurement');
const { Sequelize } = require('sequelize');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static folder for production
let publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
app.use(express.static(path.join(publicFolder, 'build')));

// define base api 
finale.initialize({ 
  app: app,
  base: '/api',
  sequelize: database 
});

// create endpoints
finale.resource({
  model: UseCase,
  endpoints: ['/useCases', '/useCases/:id'],
});

finale.resource({
  model: Measurement,
  endpoints: ['/measurements', '/measurements/:id'],
  search: {
    param: 'useCaseId',
    operator: Sequelize.Op.eq,
    attributes: ["useCase"]
  },
  pagination: false
});

// start express server
database
  .sync()
  .then(() => {
    app.listen(port, () => {
     console.log(`Listening on port ${port}`);
  });
});