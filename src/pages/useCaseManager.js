import React, { Component, Fragment } from 'react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Delete as DeleteIcon, Create as CreateIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import UseCaseEditor from '../components/useCaseEditor';
import ErrorSnackbar from '../components/errorSnackbar';

const styles = theme => ({
  useCase: {
    marginTop: theme.spacing(2),
    outline: 0,
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

class UseCaseManager extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      useCases: [],
      error: null,
    };
  }

  componentDidMount() {
    this.getUseCases();
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

  async getUseCases() {
    this.setState({ 
      loading: false, 
      useCases: (await this.fetch('get', '/useCases')) || [] 
    });
  }

  onSaveUseCase  = async (id, name, measurementOptions) => {
    var postData = {
      name: name,
      measurementOptions: measurementOptions
    }

    if (id) {
      await this.fetch('put', `/useCases/${id}`, postData);
    } else {
      await this.fetch('post', '/useCases', postData);
    }

    this.props.history.goBack();
    this.getUseCases();
  }

  async deleteUseCase(useCase) {
    var that = this

    if (window.confirm(`Are you sure you want to delete "${useCase.name}"`)) {
      this.fetch('delete', `/useCases/${useCase.id}`);
      let measurements = await this.fetch('get', `/measurements?useCaseId=${useCase.id}`);

      // delete also all measurements
      measurements.forEach(function(element) {
        that.fetch('delete', `/measurements/${element.id}`);
      })

      this.getUseCases();
    }
  }

  renderUseCaseEditor = ({ match }) => {
    if (this.state.loading) return null;

    let id = match.params.id
    const useCase = find(this.state.useCases, { id: Number(id) });

    if (!useCase && id !== 'new') return <Redirect to="/useCases" />;

    // reset useCaseId if copying usecase
    if(match.path.includes("copy")) {
      useCase.id = ""
    }

    return <UseCaseEditor useCase={useCase} onSave={this.onSaveUseCase} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="h4">Use Cases</Typography>
        {this.state.useCases.length > 0 ? (
          // usecases available
          <Paper elevation={1} className={classes.useCase}>
            <List>
              {orderBy(this.state.useCases, ['updatedAt', 'name'], ['desc', 'asc']).map(useCase => (
                <ListItem key={useCase.id} button component={Link} to={`/useCases/${useCase.id}/measurements`}>
                  <ListItemText
                    primary={useCase.name}
                    secondary={useCase.updatedAt && `Updated ${moment(useCase.updatedAt).fromNow()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton component={Link} to={`/useCases/${useCase.id}/copy`} color="inherit">
                      <FileCopyIcon />
                    </IconButton>
                    <IconButton component={Link} to={`/useCases/${useCase.id}`} color="inherit">
                      <CreateIcon />
                    </IconButton>
                    <IconButton onClick={() => this.deleteUseCase(useCase)} color="inherit">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          // no usecases available
          !this.state.loading && <Typography variant="subtitle1">So far no use cases have been created</Typography>
        )}
        
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to="/useCases/new"
        >
          <AddIcon />
        </Fab>

        <Route exact path="/useCases/:id" render={this.renderUseCaseEditor} />
        <Route exact path="/useCases/:id/copy" render={this.renderUseCaseEditor} />
        
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
)(UseCaseManager);