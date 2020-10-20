import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  withStyles
} from '@material-ui/core';

const styles = {
  flex: {
    flex: 1,
  },
};

const AppHeader = ({ classes }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Counter
      </Typography>
        <Button color="inherit" component={Link} to="/">Case</Button>
        <div className={classes.flex} />
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppHeader);