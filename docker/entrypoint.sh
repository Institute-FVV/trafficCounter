#!/bin/bash

# build node app again with docker currently present env variables
npm run build

# publish app
node src/server