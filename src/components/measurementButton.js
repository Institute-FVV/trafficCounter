import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Button,
} from '@material-ui/core';

const styles = theme => ({
    button: props => ({
      width: (1/(props.length+1))*100 + '%',
      height: theme.spacing(7),
      margin: theme.spacing(1, 0.9, 1, 0.1)
    }),
  });

class MeasurementButton extends Component {
    constructor() {
        super();
        this.state = {
            groupName: '',
            buttonValue: ''
        }
    }

    componentDidMount() {
        this.setState({ 
            groupName: this.props.groupName,
            buttonValue: this.props.buttonValue
        })
    }

    handleButtonPress = () => {
        const { onClick } = this.props
        onClick(this.state.groupName, this.state.buttonValue)
    }

    render() {
        const { classes, buttonValue } = this.props

        return (
            <Button variant="contained" className={classes.button} onClick={this.handleButtonPress} >{buttonValue}</Button>
        )
    }
};

export default compose(
    withStyles(styles), 
)(MeasurementButton);