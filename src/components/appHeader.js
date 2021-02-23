import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  withStyles,
} from '@material-ui/core';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Help from './help'

const styles = theme => ({
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
  helpIcon: {
    fontSize: '4.5em',
    color: 'white',
  },
  toolBar: {
    backgroundColor: "#ba4682",
    padding: theme.spacing(1)
  },
  image: {
    height: '40px'
  }
})

class AppHeader extends Component {
  constructor() {
    super()

    this.state = {
      showHelp: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.setState({
      showHelp: !this.state.showHelp
    })
  }

  render() {
    const { classes } = this.props

    return (
      <AppBar position="static">
        <Toolbar className={ classes.toolBar }>
          <Button color="inherit" component={ Link } to="/">
            <img className={ classes.image } src={`${window.location.origin}/images/fvv-header.png`} alt="FVV header image"/>
            <AvTimerIcon/>            
            <Typography variant="h6" color="inherit">
              Counter 
            </Typography>
          </Button>

          <Button 
            onClick={ this.handleChange }
            className={ classes.headerButton }
          >
            <HelpOutlineIcon 
              color="secondary"
              aria-label="add"
              className={ classes.helpIcon }
            />
          </Button>

          <Help 
            handleChange={ this.handleChange } 
            showModal={ this.state.showHelp }
          />
        </Toolbar>
      </AppBar>
    )
  }
}

export default compose(
  withStyles(styles), 
)(AppHeader);