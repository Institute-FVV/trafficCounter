import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab
} from '@material-ui/core';
import { List as ListIcon} from '@material-ui/icons';

import { compose } from 'recompose';
import ErrorSnackbar from '../../components/error/errorSnackbar';
import MeasurementButtons from '../../components/measurementButtons/measurementButtons';

const styles = theme => ({
  fabEdit: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  },
  fabExport: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(10),
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(1),
      right: theme.spacing(10),
    },
  },
  root: {
    flexGrow: 1,
  },

});

class UseCaseMeasurement extends Component {
  state = {
    loading: true,
    useCaseId: '',
    useCaseDetails: '',
    measurements: [],
    error: null,
  };

  componentDidMount() {
    const useCaseId = this.props.history.location.pathname.split('/')[2];

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

  saveMeasurement = async (value) => {
    let postData = {
      "useCase": this.state.useCaseId,
      "value": value 
    }
    
    await this.fetch('post', `/measurements/`, postData);
    this.getMeasurements()
  }

  handleButtonPress = async(value) => {
    this.saveMeasurement(value)
  }

  render() {
    const { classes } = this.props;
    const to = "/useCases/" + this.state.useCaseId + "/measurements/view"

    let onClickFunction = this.handleButtonPress

    const listItems = []
    if(this.state.useCaseDetails.measurementOptions){
      this.state.useCaseDetails.measurementOptions.forEach(function (value) {
        listItems.push(<MeasurementButtons onClick={onClickFunction} value={value.name}/>)
      })
    }

    return (
      <Fragment>
        <Typography variant="h5">Measurements for { this.state.useCaseDetails.name} </Typography>
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

        {this.state.useCaseDetails.name !== "" ? (
        
        <Fragment>
          {listItems}
        </Fragment>

        ) : (
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