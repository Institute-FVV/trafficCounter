require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 8080;
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { database } = require('./database')
const usecaseApi = require('./routes/useCaseRoutes')
const measurementApi = require('./routes/measurementRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static folder for production
let publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
app.use(express.static(path.join(publicFolder, 'build')));

// serve api 
app.use('/api/useCases', usecaseApi)
app.use('/api/measurements', measurementApi)

database.sync().then(function(){
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
 });
})

// forward all requests to the react app
app.get('*', function(req, res) {
  res.sendFile(path.join(publicFolder, 'build', 'index.html'));
});