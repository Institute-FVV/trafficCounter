import React, { Component, Fragment } from 'react';
import { withRouter  } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Grid
} from '@material-ui/core';
import { compose } from 'recompose';

import ActionItems from '../components/actionItems';
import ErrorSnackbar from '../components/errorSnackbar';
import MeasurementButtons from '../components/measurementButton';
import InfoSnackbar from '..//components/infoSnackbar'

const SYNC_INTERVAL = 5000
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    position: 'absolute',
    top: theme.spacing(4.5),
    left: theme.spacing(13.5),
    color: 'white'
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
      measurementsCountOnline: 0,
      measurementsCountOffline: 0,
      pendingMeasurements: [],
      lastMeasurementId: "",
      pinCode: null,
      displayText: true,

      success: null,
      error: null,
      loading: false,
      connectivityIssue: false,
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

    this.checkPinCode(useCaseId, body)
  }

  checkPinCode(useCaseId, body) { 
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

  async fetch(method, endpoint, body, surpressError) {
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
        this.setState({
          error: { message: "Error when communicating with backend: " + response.statusText }
        })

        throw new Error("Error communicating with backend")
      }
    } catch (error) {
      // used to surpress the error notifcation
      if(!surpressError) {
        this.setState({ 
          error: error,
          loading: false,
        });
      }

      throw new Error(error)      
    }
  }

  async getMeasurementsCount() {
    let measurementsCount = await this.fetch('get', '/useCases/' + this.state.useCaseId + '/measurements/count')

    this.setState({
      measurementsCountOnline: measurementsCount || 0,
      measurementsCountOffline: this.state.measurementsCountOnline + this.state.pendingMeasurements.length
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

    let pendingMeasurements = this.state.pendingMeasurements
    pendingMeasurements.push(postData)
    
    localStorage.setItem("pendingMeasurements", JSON.stringify(pendingMeasurements))

    this.setState({
      pendingMeasurements: pendingMeasurements
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
    let that = this

    return (
      <Fragment>
        <Typography className={ classes.title } variant="h6">Measurements { this.state.useCaseDetails.name } </Typography>

        { /* action items */ }
        <ActionItems
          toggleFullscreen = { this.toggleFullscreen }
          toogleIconView = { this.toogleIconView }
          shareLink = { this.shareLink }
          deleteLastMeasurement = { this.deleteLastMeasurement }
          measurementsCount = { this.state.measurementsCount }
          useCaseId = { this.state.useCaseId }
        />

        {this.state.useCaseDetails !== "" ? (
          // measurements present
        
          this.state.useCaseDetails.measurementOptions.map(function(groupElement, groupIndex, groupArray) {             
            // iteration for groups

            let buttons = groupElement.options.map(function(optionElement, opionIndex, optionsArray) {
              // iteration for buttons
              
              return(
                <Grid item xs>
                  <MeasurementButtons 
                    onClick={ that.saveMeasurement} 
                    key={`${ opionIndex }-${ optionElement.name }`}
                    groupName={ groupElement.name } 
                    buttonValue={ optionElement }
                    length={ optionsArray.length } 
                    groupLength={ groupArray.length }
                    displayText={ that.state.displayText }
                  />
                </Grid>
              )
            })

            return(
              <div className={ classes.root } key={ `${ groupIndex }buttonList` }>
                <Typography className={classes.measurementGroupTitle}>{ groupElement.name }</Typography>
                <Grid container spacing={1}>
                  {buttons}
                </Grid>
              </div>
            )
          })

        ) : (
          // no measurements could be found
          !this.state.loading && (
            <Typography variant="subtitle1">No measurements have been taken so far</Typography>
          )
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