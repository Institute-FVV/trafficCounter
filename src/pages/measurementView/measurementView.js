import React, { Component, Fragment, forwardRef  } from 'react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Paper
} from '@material-ui/core';
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
import { compose } from 'recompose';

import ErrorSnackbar from '../../components/error/errorSnackbar';

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
  useCase: {
    marginTop: theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
});

class MeasurementView extends Component {
  state = {
    loading: true,
    useCase: "",
    measurements: [],
    error: null,
  };

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
    let useCaseName = useCase.name
    let measurements = (await this.fetch('get', '/measurements/?useCaseId=' + useCaseId)) || []

    measurements.forEach(function (element) {
      element.useCase = useCaseName
    })


    this.setState({ loading: false, 
      useCase: (await this.fetch('get', '/useCases/' + useCaseId)) || [], 
      measurements: measurements
    });
   
  }

  render() {
    const { classes } = this.props;
    const title = "Measurements for " + this.state.useCase.name

    return (
      <Fragment>
        {this.state.measurements.length > 0 ? (
          <Paper elevation={1} className={classes.useCase}>
            <MaterialTable
              icons={tableIcons}
              title={title}
              columns={[
                { title: 'Use case', field: 'useCase'},
                { title: 'Measurement value', field: 'value' },
                { title: 'updatedAt', field: 'updatedAt' }
              ]}
              data={this.state.measurements}        
              options={{
                exportButton: true,
                filtering: true,
                search: false,
                pageSize: 20,
                pageSizeOptions: [20, 50,100,1000]
              }}
            />

          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subtitle1">So far no use measurements have been taken</Typography>
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