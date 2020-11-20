import React from 'react';
import { Link, Route } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  withStyles,
} from '@material-ui/core';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { compose } from 'recompose';
import Help from './help'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  headerButton: {
    position: 'fixed',
    top: theme.spacing(-0.5),
    right: theme.spacing(),
    color: '#f50057',
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(-1),
      right: theme.spacing(0),
    }
  },
  text: {
    fontSize: '4.5em',
    color: '#f50057',
  },
  toolBar: {
    backgroundColor: "#a30d35",
    padding: theme.spacing(1)
  }
})

const renderHelp = function () {
  return <Help/>;
}

const AppHeader = ({ classes }) => (
  <AppBar position="static">
    <Toolbar className={classes.toolBar}>
      <Button color="inherit" component={Link} to="/">
        <AvTimerIcon/>
        <Typography variant="h6" color="inherit">
          Counter 
        </Typography>
      </Button>

      <Button 
        component={Link}
        to="/help"
        className={classes.headerButton}
      >
        <HelpOutlineIcon 
          color="secondary"
          aria-label="add"
          className={classes.text}
        />
      </Button>
      <Route exact path="/help" render={renderHelp} />
    </Toolbar>
  </AppBar>
);

export default compose(
  withStyles(styles),
)(AppHeader);