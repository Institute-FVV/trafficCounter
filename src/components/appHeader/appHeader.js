import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
} from '@material-ui/core';

const AppHeader = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        My React App
      </Typography>
      <Router>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/posts">Posts Manager</Button>
      </Router>
    </Toolbar>
  </AppBar>
);

export default AppHeader;