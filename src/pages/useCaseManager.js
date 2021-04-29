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
  TextField
} from '@material-ui/core';
import { Delete as DeleteIcon, Create as CreateIcon, Add as AddIcon } from '@material-ui/icons';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import { find, orderBy, filter } from 'lodash';
import { compose } from 'recompose';

import ReCAPTCHA from "react-google-recaptcha";
import { captcha_site_key } from '../components/config';
import UseCaseEditor from '../components/useCaseEditor';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar'
import InfoSnackbar from '../components/infoSnackbar'

const styles = theme => ({
  useCaseDiv: {
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
    }
  },
  serachDiv: {
    marginBottom: theme.spacing(1)
  },
  searchInput: {
    width: "100%",
  }
});
class UseCaseManager extends Component {
  constructor() {
    super();

    this.state = {
      captureValue: localStorage.getItem("captureValue") || "[empty]",
      captureLoad: JSON.parse(localStorage.getItem("captureLoad")) || false,
      captureExpired: JSON.parse(localStorage.getItem("captureExpired")),

      query: "",
      useCases: [],

      success: null,
      loading: false,
      error: null,
    };

    this._reCaptchaRef = React.createRef();
  }

  componentDidMount() {
    // if captcha is empty execute the captcha query, prompt users some random pictures
    if(this._reCaptchaRef.current && 
      (this.state.captureExpired === null || this.state.captureExpired === false)) {
      this._reCaptchaRef.current.execute()
    }
    
    this.getUseCases();
  }

  async fetch(method, endpoint, body) {
    this.setState({loading: true})

    try {
      const response = await fetch(`/api${ endpoint }`, {
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
      }
    } catch (error) {
      console.error(error);

      this.setState({ 
        error: error,
        loading: false 
      });
    }
  }

  getUseCases() {
    this.fetch('get', '/useCases')
      .then(useCases => {
        this.setState({
          useCases: useCases || [] 
        })
    })   
  }

  onSaveUseCase  = async (id, name, pinCode, measurementOptions) => {
    var postData = {
      name: name,
      pinCode: pinCode,
      measurementOptions: measurementOptions
    }

    if (id) {
      await this.fetch('put', `/useCases/${ id }`, postData);
    } else {
      await this.fetch('post', '/useCases', postData);
    }

    this.getUseCases();    
    if(this.state.error === null) {
      this.props.history.goBack();      
    }
  }

  async deleteUseCase(useCase) {
    var that = this

    if (window.confirm(`Are you sure you want to delete "${ useCase.name }"`)) {
      // delete also all measurements
      let measurements = await this.fetch('get', `/useCases/${ useCase.id }/measurements`);

      this.fetch('delete', `/useCases/${useCase.id}`);

      measurements.measurementOptions.forEach(function(element) {
        that.fetch('delete', `/measurements/${ element.id }`);
      })

      if(this.state.error === null) {
        this.setState({
          success: "Use case successfully deleted"
        })
      }

      this.getUseCases();
    }
  }

  handleCaptchaChange = value => {    
    // if value is null recaptcha expired
    if (value === null) {
      this.setState({
        captureValue: value,
        caputreExpired: true,
        captureLoad: true
      });
    } else {
      this.setState({
        captureValue: value,
        captureExpired: false,
        captureLoad: true
      }, () => {
        // store the captcha values in the local storage so that after reload they are not requested again
        localStorage.setItem("captureValue", value)
        localStorage.setItem("captureExpired", false)
        localStorage.setItem("captureLoad", true)
      })
    }
  };

  handleSearchChange = evt => {
    this.setState({ 
      query: evt.target.value 
    });
  };

  renderUseCaseEditor = ({ match }) => {
    let id = match.params.id
    let useCase = find(this.state.useCases, { id: Number(id) });

    if ((!useCase && match.path.includes("copy")) || (!useCase && id !== 'new')) {
      return <Redirect to="/useCases" />
    }

    // reset useCaseId if copying usecase
    // create new object
    if(match.path.includes("copy")) {
      useCase = Object.create(useCase)
      useCase.name = useCase.name + " (Copy)"
    }

    return (
      <UseCaseEditor 
        useCase={ useCase } 
        errorMessage={ this.state.error } 
        onSave={ this.onSaveUseCase } 
      />
    )
  };

  render() {
    const { classes } = this.props;
    const that = this
    let useCases = filter(this.state.useCases, function(obj) {
      return obj.name.toUpperCase().includes(that.state.query.toUpperCase());
    })

    return (
      <Fragment>
        <Typography variant="h4">Use Cases</Typography>
        { /* captcha section */ }
        { (this.state.captureExpired === null || this.state.captureExpired === true) && (
          <ReCAPTCHA  
            ref={ this._reCaptchaRef }
            sitekey={ captcha_site_key }
            size="invisible"
            onChange={ this.handleCaptchaChange }
          />
        )}

        { /* use case area */ }
        { this.state.useCases.length > 0 ? (
          // usecases available
          <Paper elevation={ 1 } className={ classes.useCaseDiv }>
            <div className={ classes.serachDiv }>
              <TextField
                required 
                type="text"
                key="inputQuery"
                placeholder="Search"
                label="Search"
                className={ classes.searchInput }
                value={ this.state.query }
                onChange={ this.handleSearchChange }
                variant="outlined"
                size="small"
                autoFocus 
              />
            </div>

            <List>
              {orderBy(useCases, ['updatedAt', 'name'], ['desc', 'asc']).map(useCase => (
                <ListItem key={ useCase.id } button component={ Link } to={ `/useCases/${useCase.id}/measurements` }>
                  <ListItemText
                    primary={ useCase.name }
                    secondary={ useCase.updatedAt && `Updated ${moment(useCase.updatedAt).fromNow()}` }
                  />
                  {(this.state.captureExpired !== null && this.state.captureExpired === false) && (
                    <ListItemSecondaryAction>
                      <IconButton component={ Link } to={ `/useCases/${ useCase.id }/copy` } color="inherit">
                        <FileCopyIcon />
                      </IconButton>
                      <IconButton component={ Link } to={ `/useCases/${ useCase.id }/edit` } color="inherit">
                        <CreateIcon />
                      </IconButton>
                      <IconButton onClick={() => this.deleteUseCase(useCase)} color="inherit">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}

              { /* must be placed here so that the state is correctly loaded */}
              <Route exact path="/useCases/:id/edit" render={ this.renderUseCaseEditor } />
              <Route exact path="/useCases/:id/copy" render={ this.renderUseCaseEditor } />
            </List>
          </Paper>

          
        ) : (
          // no usecases available
          !this.state.loading && (
            <Typography variant="subtitle1">So far no use cases have been created</Typography>
          )
        )}
        
        { (this.state.captureExpired !== null && this.state.captureExpired === false) && (
          <Fragment>
            <Fab
              color="secondary"
              aria-label="add"
              className={ classes.fab }
              component={ Link }
              to="/useCases/new"
            >
              <AddIcon />
            </Fab>
            
            <Route exact path="/useCases/:id" render={ this.renderUseCaseEditor } />
          </Fragment>          
        )}

        { /* Flag based display of loadingbar */ }
        { this.state.loading && (
          <LoadingBar/>
        )}    
        
        { /* Flag based display of error snackbar */ }
        { this.state.error && (
          <ErrorSnackbar
            onClose={() => this.setState({ error: null })}
            message={ this.state.error.message }
          />
        )}

        { /* Flag based display of info snackbar */ }
        { this.state.success && (
          <InfoSnackbar
            onClose={() => this.setState({ success: null })}
            message={ this.state.success }
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