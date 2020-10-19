import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import { } from './config';
import AppHeader from '../appHeader/appHeader';
import UseCaseManager from '../../pages/useCaseManager/useCaseManager';
import UseCaseMeasurement from '../../pages/useCaseMeasurement/useCaseMeasurement';
import MeasurementView from '../../pages/measurementView/measurementView';

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
      <Route exact path="/" component={UseCaseManager} />
      <Route exact path="/useCases" component={UseCaseManager} />
      <Route exact path="/useCases/:id/measurements" component={UseCaseMeasurement} />
      <Route exact path="/useCases/:id" component={UseCaseManager} />
      <Route exact path="/useCases/:id/measurements/view" component={MeasurementView} />
    </main>
  </Fragment>
);

export default withStyles(styles)(App);