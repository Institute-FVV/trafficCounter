import React, { Component, Fragment } from 'react';
import { withRouter, Route, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab
} from '@material-ui/core';
import { Create as CreateIcon, ImportExport as ImportExportIcon } from '@material-ui/icons';

import { compose } from 'recompose';
import { find, orderBy } from 'lodash';
import ErrorSnackbar from '../../components/error/errorSnackbar';
import MeasurementButtons from '../../components/measurementButtons/measurementButtons';
import MeasurementEditor from '../../components/measurementEditor/measurementEditor';

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

class StreetMeasurement extends Component {
  state = {
    loading: true,
    streetId: '',
    street: '',
    measurements: [],
    error: null,
  };

  componentDidMount() {
    this.getStreetMeasurement();
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

  async getStreetMeasurement() {
    const streetId = this.props.history.location.pathname.split('/')[2];
    this.setState({ loading: false, streetId: streetId, street: (await this.fetch('get', '/streets/' + streetId)) || [] });
  }

  saveMeasurement = async (measurement) => {
    if (measurement.id) {
      await this.fetch('put', `/measurements/${measurement.id}`, measurement);
    } else {
      await this.fetch('post', '/measurements', measurement);
    }

    this.props.history.goBack();
    this.getStreets();
  }

  saveMeasurementDetails = async (details) => {
    this.setState({loading: true, directions: details})
    this.props.history.goBack();
  }

  renderStreetEditor = () => {
    return <MeasurementEditor directions={this.state.directions} onSave={this.saveMeasurementDetails} />;
  };


  render() {
    const { classes } = this.props;
    const to = "/streets/" + this.state.streetId + "/measurements/edit" 

    const listItems = []
    console.log(this.state)
    for(let i = 0; i < this.state.street.amountOptions; i++) {
      listItems.push(<MeasurementButtons/>)
    }

    return (
      <Fragment>
        <Typography variant="h5">Measurements for { this.state.street.streetName}</Typography>
        <Fab
          color="secondary"
          aria-label="edit"
          className={classes.fabEdit}
          component={Link}
          to={to}
        >
           <ImportExportIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="export"
          className={classes.fabExport}
          component={Link}
          to={to}
        >
          <CreateIcon />
        </Fab>

        {this.state.street.streetName !== "" ? (
        
        <Fragment>
          {listItems}
        </Fragment>

        ) : (
          !this.state.loading && <Typography variant="subtitle1">No streets to display</Typography>
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
)(StreetMeasurement);