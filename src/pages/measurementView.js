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
import LoadingBar from '../components/loadingBar'

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
      useCase: "",
      measurements: [],

      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.getMeasurements();
  }

  async fetch(method, endpoint, body) {
    this.setState({loading: true})

    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      this.setState({loading: false})
      
      if(response.ok && (response.status === 201 || response.status === 200)) {
        return await response.json();
      } else {
        console.error(response.status)
        this.setState({
          error: { message: "Error when communicating with backend: " + response.statusText }
        })

        throw new Error("Error communicating with backend")
      }
    } catch (error) {
      console.error(error);

      this.setState({ 
        error: error,
        loading: false
      });
    }
  }

  async getMeasurements() {
    const useCaseId = this.props.match.params.id

    // get use case and corresponding measurements
    let useCase = (await this.fetch('get', '/usecases/' + useCaseId + "/measurements")) || []
    let measurements = useCase.measurements
    let tableOutput = []

    if(measurements) {
      measurements.forEach(measurement => {
          tableOutput.push({
            useCase: useCase.name,
            groupName: measurement.groupName,
            value: measurement.value,
            timestamp: measurement.timestamp.split("+")[0]
          })
      })

      this.setState({ 
        useCase: useCase, 
        measurements: measurements,
        tableOutput: tableOutput
      });
    }
  }

  getDateTime() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    
    return date + '_' + time;
  }

  render() {
    const { classes } = this.props;
    const title = "List measurements for " + this.state.useCase.name                              // define title of website
    const exportFileName = "list_measurements_" + this.state.useCase.name + "_" + this.getDateTime()        // define export file name 

    return (
      <Fragment>
        {this.state.measurements.length > 0 ? (
          // data available, present table
          <MaterialTable
            icons={ tableIcons }
            title={ title }
            columns={[
              { title: 'Use case', field: 'useCase'},
              { title: 'Measurement group', field: 'groupName'},
              { title: 'Measurement value', field: 'value' },
              { title: 'Timestamp', field: 'timestamp' }
            ]}
            data={ this.state.tableOutput }        
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
            <Typography variant="subtitle1">So far no measurements have been recorded for use case { this.state.useCase.name }</Typography>
          )
        )}

        { /* Flag based display of error snackbar */ }
        {this.state.error && (
          <ErrorSnackbar
            onClose={() => this.setState({ error: null })}
            message={ this.state.error.message }
          />
        )}

        { /* Flag based display of loadingbar */ }
        {this.state.loading && (
          <LoadingBar/>
        )}
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(MeasurementView);