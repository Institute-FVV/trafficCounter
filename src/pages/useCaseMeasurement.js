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

const styles = theme => ({
  fabEdit: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(10.5),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(0),
      right: theme.spacing(10.5),
    },
  },
  fabExport: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(19),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(0),
      right: theme.spacing(19),
    },
  }
});

class UseCaseMeasurement extends Component {
  constructor() {
    super();
    this.state = {
      useCaseId: '',
      useCaseDetails: '',
      measurements: [],
      error: null,
    };

    this.saveMeasurement = this.saveMeasurement.bind(this)
  }

  componentDidMount = () => {
    const useCaseId = this.props.match.params.id;

    // wait till state is fully set, then load usecases
    this.setState({useCaseId: useCaseId}, this.getUseCases)
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

  async getUseCases() {
    this.setState({
      useCaseDetails: (await this.fetch('get', '/useCases/' + this.state.useCaseId)) || []
    })

    this.getMeasurements()
  }

  async saveMeasurement (groupName, buttonValue) {
    let postData = {
      "useCase": this.state.useCaseId,
      "groupName": groupName,
      "value": buttonValue 
    }
    
    await this.fetch('post', `/measurements/`, postData);
    this.getMeasurements()
  }

  render() {
    const { classes } = this.props;
    const to = "/useCases/" + this.state.useCaseId + "/measurements/view"

    let fun_saveMeasurement = this.saveMeasurement

    return (
      <Fragment>
        <Typography variant="h5">Executing measurements for { this.state.useCaseDetails.name} </Typography>
        <Fab
          color="secondary"
          aria-label="edit"
          className={classes.fabEdit}
        >
           {this.state.measurements.length}
        </Fab>
        <Fab
          color="secondary"
          aria-label="export"
          className={classes.fabExport}
          component={Link}
          to={to}
        >
          <ListIcon />
        </Fab>

        {this.state.useCaseDetails !== "" ? (
          // measurements present
        
          this.state.useCaseDetails.measurementOptions.map(function(groupElement, groupIndex) {             
            // iteration for groups

            let buttons = groupElement.options.map(function(optionElement, opionIndex, optionsArray) {
              // iteration for buttons
              return(
                <MeasurementButtons 
                  onClick={fun_saveMeasurement} 
                  groupName={groupElement.name} 
                  buttonValue={optionElement.name} 
                  length={optionsArray.length} 
                  key={`${opionIndex}-${optionElement.name}`}/>
              )
            })

            return(
              <div key={`${groupIndex}buttonList`}>
                <Typography>{groupElement.name}</Typography>
                <Box className={classes.buttonList}>
                  {buttons}
                </Box>
              </div>
            )
          })

        ) : (
          // no measurements could be found
          !this.state.loading && <Typography variant="subtitle1">No measurements have been taken so far</Typography>
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