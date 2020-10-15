import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import { } from './config';
import AppHeader from '../appHeader/appHeader';
import StreetManager from '../../pages/streetManager/streetManager';
import StreetMeasurement from '../../pages/streetMeasurement/streetMeasurement';

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
    <CssBaseline />
    <AppHeader />
    <main className={classes.main}>
      <Route exact path="/" component={StreetManager} />
      <Route exact path="/streets" component={StreetManager} />
      <Route path="/streets/:id/measurements" component={StreetMeasurement} />
      <Route exact path="/streets/:id" component={StreetManager} />
    </main>
  </Fragment>
);

export default withStyles(styles)(App);