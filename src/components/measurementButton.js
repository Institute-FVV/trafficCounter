import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Button,
  Icon
} from '@material-ui/core';

const styles = theme => ({
    button: props => ({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '10vh',
      overflow: "hidden",
      wordBreak: 'break-all',
    }),
  });

class MeasurementButton extends Component {
    constructor() {
        super();
        this.state = {
            groupName: '',
            buttonValue: '',
            icon: '',
        }
    }

    componentDidMount() {
        this.setState({ 
            groupName: this.props.groupName,
            buttonValue: this.props.buttonValue.name,
            icon: this.props.buttonValue.icon,
        })
    }

    handleButtonPress = () => {
        const { onClick } = this.props
        onClick(this.state.groupName, this.state.buttonValue)
    }

    render() {
        const { classes, displayText } = this.props

        return (
            <Button variant="outlined" 
                    color="primary" 
                    className={ classes.button } 
                    onClick={this.handleButtonPress} 
            >
                { /* display text only if user wants that */}
                {displayText && (
                    this.state.buttonValue
                )}
                <br/>

                { this.state.icon && (
                    <Icon>{this.state.icon}</Icon>
                )}
            </Button>
        )
    }
};

export default compose(
    withStyles(styles), 
)(MeasurementButton);