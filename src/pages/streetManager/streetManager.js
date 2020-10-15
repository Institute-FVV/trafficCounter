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

import StreetEditor from '../../components/streetEditor/streetEditor';
import ErrorSnackbar from '../../components/error/errorSnackbar';

const styles = theme => ({
  streets: {
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

class StreetManager extends Component {
  state = {
    loading: true,
    streets: [],
    error: null,
  };

  componentDidMount() {
    this.getStreets();
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

  async getStreets() {
    this.setState({ loading: false, streets: (await this.fetch('get', '/streets')) || [] });
  }

  saveStreet = async (street) => {
    console.log(street)
    if (street.id) {
      await this.fetch('put', `/streets/${street.id}`, street);
    } else {
      await this.fetch('post', '/streets', street);
    }

    this.props.history.goBack();
    this.getStreets();
  }

  async deleteStreet(street) {
    if (window.confirm(`Are you sure you want to delete "${street.streetName}"`)) {
      await this.fetch('delete', `/streets/${street.id}`);
      this.getStreets();
    }
  }

  renderStreetEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    const street = find(this.state.streets, { id: Number(id) });

    if (!street && id !== 'new') return <Redirect to="/streets" />;

    return <StreetEditor street={street} onSave={this.saveStreet} />;
  };



  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="h4">Streets</Typography>
        {this.state.streets.length > 0 ? (
          <Paper elevation={1} className={classes.streets}>
            <List>
              {orderBy(this.state.streets, ['updatedAt', 'streetName'], ['desc', 'asc']).map(street => (
                <ListItem key={street.id} button component={Link} to={`/streets/${street.id}/measurements`}>
                  <ListItemText
                    primary={street.streetName}
                    secondary={street.updatedAt && `Updated ${moment(street.updatedAt).fromNow()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton component={Link} to={`/streets/${street.id}`} color="inherit">
                      <CreateIcon />
                    </IconButton>
                    <IconButton onClick={() => this.deleteStreet(street)} color="inherit">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subtitle1">No streets to display</Typography>
        )}
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to="/streets/new"
        >
          <AddIcon />
        </Fab>
        <Route exact path="/streets/:id" render={this.renderStreetEditor} />
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
)(StreetManager);