require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 8080;
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const finale  = require('finale-rest');
const { Sequelize } = require('sequelize');

const { database } = require('./database')
const { UseCase } = require('./models/useCase')
const { Measurement } = require('./models/measurement');

const app = express();
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

// create endpoints for usecase and measurements
finale.resource({
  model: UseCase,
  endpoints: ['/useCases', '/useCases/:id'],
});

// provide possibility to only receive mesurements from a given usecase
// disable pagination so that all that can be received in one step
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
  .sync({ })
  .then(() => {
    app.listen(port, () => {
     console.log(`Listening on port ${port}`);
  });
});

// forward all requests to the react app
app.get('*', function(req, res) {
  res.sendFile(path.join(publicFolder, 'build', 'index.html'));
});