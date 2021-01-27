import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Button,
  Icon
} from '@material-ui/core';

const styles = theme => ({
    button: props => ({
      width: (1/(props.length+1))*100 + '%',
      height: (1/(props.groupLength))*100 - 6 + "vh",
      overflow: "hidden",
      minWidth: '0px',
      margin: theme.spacing(0.2, 0.2, 0.2, 0.2),
      wordBreak: 'break-all'
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
        const { classes, displayIcon } = this.props

        return (
            <Button variant="outlined" 
                    color="primary" 
                    className={ classes.button } 
                    onClick={this.handleButtonPress} 
            >
                { this.state.buttonValue }

                { /* display icons only if user wants that */}
                {displayIcon && (
                    <Icon>{this.state.icon}</Icon>
                )}
            </Button>
        )
    }
};

export default compose(
    withStyles(styles), 
)(MeasurementButton);