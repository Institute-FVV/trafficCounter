import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';
import {
  Typography,
  withStyles,
  Button, 
  ButtonGroup
} from '@material-ui/core';
import { DirectionsBike as DirectionsBikeIcon, DirectionsWalk as DirectionsWalkIcon, DriveEta as DriveEtaIcon} from '@material-ui/icons';


const styles = theme => ({
    margin: {
      width: theme.spacing(30),
      height: theme.spacing(10),
      margin: theme.spacing(3)
    },
  });

class MeasurementButtons extends Component {
    state = {
        direction: ''
    }

    componentDidUpdate() {
        if(this.state.direction !== this.props.direction)
        {
            this.setState({ direction: this.props.direction})
        }
    }

    render() {
        const { classes } = this.props
        
        return (
            <Fragment>
                <Button variant="contained" className={classes.margin}><DirectionsBikeIcon/> Bike</Button>
            </Fragment>
        )
    }
};

export default compose(
    withStyles(styles), 
)(MeasurementButtons);