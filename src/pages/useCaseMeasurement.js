import React, { Component, Fragment } from 'react';
import { withRouter, Link  } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import ShareIcon from '@material-ui/icons/Share';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import UndoIcon from '@material-ui/icons/Undo';
import { compose } from 'recompose';

import ErrorSnackbar from '../components/errorSnackbar';
import MeasurementButtons from '../components/measurementButton';
import LoadingBar from '../components/loadingBar'
import InfoSnackbar from '..//components/infoSnackbar'
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const REXECUTION_TIMEOUT = 5000   // rexecution timeout for retry of the failed fetch calls
const styles = theme => ({
  title: {
    position: 'absolute',
    top: theme.spacing(4.5),
    left: theme.spacing(13.5),
    color: 'white'
  },
  fabDelete: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(26.5),
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(16.5),
    },
  },
  fabCount: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(10.5),
    "&$disabled": {
      backgroundColor: "#f50057",
      color: "white"
    },
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(9),
    },
  },
  disabled: {},
  fabList: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(18.5),
    [theme.breakpoints.down('xs')]: {
      visibility: "hidden"
    },
  },
  fabShare: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(34.5),
    [theme.breakpoints.down('xs')]: {
      visibility: "hidden"
    },
  },
  fabToogle: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(42.5),
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(24),
    },
  },
  fabFullScreen: {
    position: 'fixed',
    top: theme.spacing(0.5),
    right: theme.spacing(50.5),
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(31.5),
    },
  },
  measurementGroupTitle: {
    fontSize: "5vh"
  }
});

class UseCaseMeasurement extends Component {
  constructor() {
    super();

    this.state = {
      useCaseId: '',
      useCaseDetails: '',
      measurementsCount: 0,
      lastMeasurementId: "",
      pinCode: null,
      displayText: true,

      success: null,
      error: null,
      loading: false,
    };

    this.saveMeasurement = this.saveMeasurement.bind(this)
    this.deleteLastMeasurement = this.deleteLastMeasurement.bind(this)
    this.shareLink = this.shareLink.bind(this)
    this.toogleIconView = this.toogleIconView.bind(this)
  }

  componentDidMount = () => {
    const useCaseId = this.props.match.params.id;
    let body = {
      pinCode: this.state.pinCode
    }

    body.pinCode = new URLSearchParams(this.props.location.search).get("pinCode")
    if(!body.pinCode) {
      body.pinCode = prompt("Please provide the secure pincode of this use case to access the measurement area")
    } 

    this.setState({
      pinCode: body.pinCode
    })

    // check if correct pin has been provided
    this.fetch('post', '/useCases/' + useCaseId + '/authorize', body)
    .then(response => {
        // if succesfully set useCase ID and load cases, otherwise show error
        this.setState({
          useCaseId: useCaseId
        }, this.getUseCase)
    })
    .catch(error => {
      this.setState({
        error: { message: "Wrong pinCode provide there for no access granted"}
      })
    })
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
        loading: false,
      });

      throw error
    }
  }

  // recursive extension of the fetch method
  // allows to reexecute failed fetch calls until they succeded
  async fetch_retry (method, endpoint, body) {
    try {
        return await this.fetch(method, endpoint, body)
    } 
    catch(err) {
      // retry after some wait period
      await this.sleep(REXECUTION_TIMEOUT)
        return this.fetch_retry(method, endpoint, body)  
    }
  }

  // function which sleeps some defined milliseconds
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getMeasurementsCount() {
    let measurementsCount = await this.fetch('get', '/useCases/' + this.state.useCaseId + '/measurements/count')

    this.setState({
      measurementsCount: measurementsCount || 0
    });
  }

  async getUseCase() {
    this.setState({
      useCaseDetails: (await this.fetch('get', '/useCases/' + this.state.useCaseId)) || []
    })

    this.getMeasurementsCount()
  }

  async deleteLastMeasurement() {
    //only allowed to delete the last measurement by themselves
    if(this.state.lastMeasurementId) {
      await this.fetch("DELETE", "/measurements/" + this.state.lastMeasurementId)

      this.getMeasurementsCount()
      this.setState({ 
        lastMeasurementId: "",
        success: "Your last measurement was successfully deleted"
      })
    } else {
      this.setState({ 
        error: {
          message: "You can only delete your own last measurement, please execute a measurement first"
        }
      })
    }
  }

  async saveMeasurement (groupName, buttonValue) {
    let postData = {
      "useCase": this.state.useCaseId,
      "groupName": groupName,
      "timestamp": Date.now(),      // set measurement time in frontend
      "value": buttonValue 
    }
    
    // post data as long till it is successfull
    await this.fetch_retry('post', `/measurements/`, postData)
    .then(response => {
      this.setState({
        lastMeasurementId: response.id
      })
      
      this.getMeasurementsCount()
    })
  }

  // copy the direct link to a use case measurement to the clipboard
  // the link includes the PIN code
  shareLink() {
    let url = window.location.href + "?pinCode=" + this.state.pinCode
    navigator.clipboard.writeText(url)

    this.setState({
      success: "Direct link copied to clipboard"
    })
  }

  // toogle if text should be displayed or not
  toogleIconView() {
    this.setState({
      displayText: !this.state.displayText
    })
  }

  // toogle full screen
  toggleFullscreen() {
    let elem = document.querySelector("body");
  
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  render() {
    const { classes } = this.props;
    const to = "/useCases/" + this.state.useCaseId + "/measurements/view"
    let that = this

    return (
      <Fragment>
        <Typography className={ classes.title } variant="h6">Measurements { this.state.useCaseDetails.name } </Typography>

        { /* action items */ }
        <Fab
          color="secondary"
          aria-label="export"
          className={ classes.fabFullScreen }
          onClick={ this.toggleFullscreen }
        >
          <FullscreenIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="export"
          className={ classes.fabToogle }
          onClick={ this.toogleIconView }
        >
          <TouchAppIcon />
        </Fab>

        <Fab
          color="secondary"
          aria-label="export"
          className={ classes.fabShare }
          onClick={ this.shareLink }
        >
          <ShareIcon />
        </Fab>

        <Fab
          color="secondary"
          aria-label="export"
          className={ classes.fabDelete }
          onClick={ this.deleteLastMeasurement }
        >
          <UndoIcon />
        </Fab>

        <Fab
          color="secondary"
          aria-label="edit"
          disabled={true}
          className={ classes.fabCount }
          classes={{disabled: classes.disabled}}
        >
          { this.state.measurementsCount }
        </Fab>
        <Fab
          color="secondary"
          aria-label="export"
          className={ classes.fabList }
          component={ Link }
          to={ to }
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
                  onClick={ that.saveMeasurement} 
                  key={`${ opionIndex }-${ optionElement.name }`}
                  groupName={ groupElement.name } 
                  buttonValue={ optionElement }
                  length={ optionsArray.length } 
                  groupLength={ groupArray.length }
                  displayText={ that.state.displayText }
                />
              )
            })

            return(
              <div key={ `${ groupIndex }buttonList` }>
                <Typography className={classes.measurementGroupTitle}>{ groupElement.name }</Typography>
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

        { /* Flag based display of loadingbar */ }
        {this.state.loading && (
          <LoadingBar/>
        )}

        { /* Flag based display of error snackbar */ }
        {this.state.error && (
          <ErrorSnackbar
            onClose={() => this.setState({ error: null })}
            message={ this.state.error.message }
          />
        )}

        { /* Flag based display of info snackbar */ }
        {this.state.success && (
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
)(UseCaseMeasurement);