import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Button
} from '@material-ui/core';

const styles = theme => ({
    margin: {
      width: theme.spacing(30),
      height: theme.spacing(10),
      margin: theme.spacing(3)
    },
  });

class MeasurementButtons extends Component {
    state = {
        value: ''
    }

    componentDidMount() {
        this.setState({ value: this.props.value})
    }

    handleButtonPress = () => {
        const { onClick } = this.props

        onClick(this.state.value)
    }

    render() {
        const { classes, value } = this.props
        
        return (
            <Fragment>
                <Button variant="contained" className={classes.margin} onClick={this.handleButtonPress} >{value}</Button>
            </Fragment>
        )
    }
};

export default compose(
    withStyles(styles), 
)(MeasurementButtons);