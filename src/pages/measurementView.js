import React, { Component, Fragment, forwardRef  } from 'react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
  Typography,
} from '@material-ui/core';
import { compose } from 'recompose';

// icons for material table
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table'

import ErrorSnackbar from '../components/errorSnackbar';

// definition used for material table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const styles = theme => ({
});

class MeasurementView extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      useCase: "",
      measurements: [],
      error: null,
    };
  }

  componentDidMount() {
    this.getMeasurements();
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
    const useCaseId = this.props.history.location.pathname.split('/')[2];

    let useCase = (await this.fetch('get', '/useCases/' + useCaseId)) || []
    let measurements = (await this.fetch('get', '/measurements/?useCaseId=' + useCaseId)) || []

    // replace usecase id with usecase name
    measurements.forEach(function (element) {
      element.useCase = useCase.name
      element.createdAt = element.createdAt.replace("+01", "")
      element.createdAt = element.createdAt.replace("+02", "")
    })

    this.setState({ 
      loading: false, 
      useCase: useCase, 
      measurements: measurements
    });
  }

  render() {
    const { classes } = this.props;
    const title = "List measurements for " + this.state.useCase.name
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    const dateTime = date + '_' + time;
    const exportFileName = "list_measurements_" + this.state.useCase.name + "_" + dateTime

    return (
      <Fragment>
        {this.state.measurements.length > 0 ? (
          // data available, present table
          <MaterialTable
            icons={tableIcons}
            title={title}
            columns={[
              { title: 'Use case', field: 'useCase'},
              { title: 'Measurement group', field: 'groupName'},
              { title: 'Measurement value', field: 'value' },
              { title: 'Created at', field: 'createdAt' }
            ]}
            data={this.state.measurements}        
            options={{
              exportFileName: exportFileName,
              exportButton: true,
              exportAllData: true,
              filtering: true,
              search: false,
              pageSize: 20,
              pageSizeOptions: [20, 50,100,1000]
            }}
          />
        ) : (
          // no data available
          !this.state.loading && (
            <Typography variant="subtitle1">So far no measurements have been recorded for use case {this.state.useCase.name}</Typography>
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
)(MeasurementView);