import React, { Component, Fragment } from 'react';
import { withRouter, Link  } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab,
  Box
} from '@material-ui/core';
import { List as ListIcon} from '@material-ui/icons';

import { compose } from 'recompose';
import ErrorSnackbar from '../components/errorSnackbar';
import MeasurementButtons from '../components/measurementButton';
import UndoIcon from '@material-ui/icons/Undo';

const styles = theme => ({
  title: {
    position: 'absolute',
    top: theme.spacing(4.5),
    left: theme.spacing(2.5),
    color: 'white'
  },
  fabDelete: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(27),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(0),
      right: theme.spacing(24),
    },
  },
  fabCount: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(10.5),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(0),
      right: theme.spacing(9),
    },
  },
  fabList: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(19),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(0),
      right: theme.spacing(16.5),
    },
  },
  groupTitle: {
    fontSize: "2.5vh"
  }
});

class UseCaseMeasurement extends Component {
  constructor() {
    super();
    this.state = {
      useCaseId: '',
      useCaseDetails: '',
      measurements: [],
      lastMeasurementId: "",
      error: null,
    };

    this.saveMeasurement = this.saveMeasurement.bind(this)
    this.deleteLastMeasurement = this.deleteLastMeasurement.bind(this)
  }

  componentDidMount = () => {
    const useCaseId = this.props.match.params.id;

    // wait till state is fully set, then load usecases
    this.setState({
      useCaseId: useCaseId
    }, this.getUseCase)
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);

      this.setState({ error });
    }
  }

  async getMeasurements() {
    this.setState({
      measurements: (await this.fetch('get', '/measurements/?useCaseId=' + this.state.useCaseId)) || []
    });
  }

  async getUseCase() {
    this.setState({
      useCaseDetails: (await this.fetch('get', '/useCases/' + this.state.useCaseId)) || []
    })

    this.getMeasurements()
  }

  async deleteLastMeasurement() {
    //only allowed to execute the last measurement by themselves
    if(this.state.lastMeasurementId) {
      await this.fetch("DELETE", "/measurements/" + this.state.lastMeasurementId)
      this.getMeasurements()
      this.setState({ lastMeasurementId: ""})
      alert("Your last measurement was delete")
    } else {
      this.setState({ error: {
        message: "You can only delete your own last measurement, please execute a measurement first."
      }})
    }
  }

  async saveMeasurement (groupName, buttonValue) {
    let postData = {
      "useCase": this.state.useCaseId,
      "groupName": groupName,
      "value": buttonValue 
    }
    
    let response = await this.fetch('post', `/measurements/`, postData);
    this.setState({
      lastMeasurementId: response.id
    })
    
    this.getMeasurements()
  }

  render() {
    const { classes } = this.props;
    const to = "/useCases/" + this.state.useCaseId + "/measurements/view"

    let fun_saveMeasurement = this.saveMeasurement

    return (
      <Fragment>
        <Typography className={classes.title} variant="h6">Measurements { this.state.useCaseDetails.name} </Typography>
        <Fab
          color="secondary"
          aria-label="export"
          className={classes.fabDelete}
          onClick={this.deleteLastMeasurement}
        >
          <UndoIcon />
        </Fab>

        <Fab
          color="secondary"
          aria-label="edit"
          className={classes.fabCount}
        >
           {this.state.measurements.length}
        </Fab>
        <Fab
          color="secondary"
          aria-label="export"
          className={classes.fabList}
          component={Link}
          to={to}
        >
          <ListIcon />
        </Fab>

        {this.state.useCaseDetails !== "" ? (
          // measurements present
        
          this.state.useCaseDetails.measurementOptions.map(function(groupElement, groupIndex, groupArray) {             
            // iteration for groups

            let buttons = groupElement.options.map(function(optionElement, opionIndex, optionsArray) {
              // iteration for buttons
              return(
                <MeasurementButtons 
                  onClick={fun_saveMeasurement} 
                  key={`${opionIndex}-${optionElement.name}`}
                  groupName={groupElement.name} 
                  buttonValue={optionElement.name} 
                  length={optionsArray.length} 
                  groupLength={groupArray.length}
                />
              )
            })

            return(
              <div key={`${groupIndex}buttonList`}>
                <Typography className={classes.groupTitle}>{groupElement.name}</Typography>
                <div>
                  {buttons}
                </div>
              </div>
            )
          })

        ) : (
          // no measurements could be found
          !this.state.loading && (
            <Typography variant="subtitle1">No measurements have been taken so far</Typography>
          )
        )}

        {this.state.error && (
          <ErrorSnackbar
            onClose={() => this.setState({ error: null })}
            message={this.state.error.message}
          />
        )}
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(UseCaseMeasurement);