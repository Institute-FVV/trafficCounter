import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import AppHeader from '../appHeader/appHeader';
import Home from '../../pages/home/home';
import PostManager from '../../pages/postManager/postManager';

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
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/posts" component={PostManager} />
    </Router>
    </main>
  </Fragment>
);

export default withStyles(styles)(App);