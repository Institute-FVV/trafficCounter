import React, { Component } from 'react';
import {
  TextField,
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography,
  FormGroup
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import './utensils'
import MeasurementOptions from './measurementOptions'

const styles = theme => ({
  modal: {
    display: 'flex',
    outline: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 800,
    maxHeight: "100%",
    overflow: "scroll"
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  formGroup: {
    border: 'solid', 
    padding: theme.spacing(1)
  },
  inputField: {
    marginTop: theme.spacing(1)
  }
});

class UseCaseditor extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      name: "",
      pinCode: "",
      measurementOptions: [
        { id: 0, name: "", options: [ { name: "", icon: ""}]}
      ]
    };

    // bindings
    this.handleOptionChange = this.handleOptionChange.bind(this)
  }

  componentDidMount() {
    const { useCase } = this.props

    if(useCase) {
      // only change state of usecase passed
      this.setState({
        id: useCase.id, 
        name: useCase.name, 
        measurementOptions: useCase.measurementOptions
      })
    }
  }

  // called by child MeasurementOptions when change of input
  handleOptionChange = function(groupIndex, options) {
    let tmpOptions = this.state.measurementOptions
    
    tmpOptions[groupIndex].options = options
    this.setState({
      measurementOptions: tmpOptions
    })
  }

  // function handling submit of form
  handleSubmit = evt => {
    evt.preventDefault();

    const { onSave } = this.props
    const { id, name, pinCode, measurementOptions } = this.state;

    // execute parent function in useCaseManager
    onSave(id, name, pinCode, measurementOptions)
  };

  handleOptionGroupName = function(index, event) {
    let measurementOptions = this.state.measurementOptions

    measurementOptions[index].name = event.target.value
    this.setState({
      measurementOptions: measurementOptions
    })
  }

  handleChange = (evt) => {
    const target = evt.target
    const name = target.name
    let value = target.value

    this.setState({
      [name]: value
    })
  }

  handleAddOptionGroup = () => {
    let idx = this.state.measurementOptions.length

    this.setState({
      measurementOptions: this.state.measurementOptions.concat([{ id: idx, name: "", options: [ { name: ""}] }])
    });
  };

  handleRemoveOptionGroup = idx => () => {
      this.setState({
        measurementOptions: this.state.measurementOptions.filter((s, sidx) => idx !== sidx)
      });
  };

  handleCopyOptionGroup = idx => () => {
    let measurementOptions = this.state.measurementOptions
    let newMeasurementOption = {...measurementOptions[idx]}
    newMeasurementOption.id = this.state.measurementOptions.length

    measurementOptions.insert(idx, newMeasurementOption)

    this.setState({
      measurementOptions: measurementOptions
    })
  }

  render() {
    const { classes, history, errorMessage} = this.props;
    var that = this

    return (
      <Modal
        className={classes.modal}
        onClose={() => history.goBack()}
        open
      >
        <Card className={classes.modalCard}>
          <form onSubmit={this.handleSubmit}>
            <CardContent className={classes.modalCardContent}>
              <TextField
                required 
                type="text"
                name="name"
                key="inputUseCase"
                placeholder="Use Case Name"
                label="Use Case Name"
                value={this.state.name}
                onChange={this.handleChange}
                variant="outlined"
                size="small"
                autoFocus 
              />

            <TextField
                required 
                type="text"
                key="inputUseCasePinCode"
                name="pinCode"
                placeholder="Use Case Pin Code"
                label="Use Case Pin Code"
                className={ classes.inputField }
                value={ this.state.pinCode }
                onChange={ this.handleChange }
                error={ errorMessage }
                variant="outlined"
                size="small"
              />

              <Typography variant="subtitle1" >Measurement Options</Typography>

              {this.state.measurementOptions.map(function(element, index) { 
                
                return (
                  <FormGroup key={`formgroup-${ index }`} className={classes.formGroup}>
                     <TextField
                      required 
                      type="text"
                      key={`input-optionGroup-${ index }`}
                      placeholder="Option group name"
                      label="Option group name"
                      value={element.name}
                      onChange={(evt) => that.handleOptionGroupName(index, evt)}
                      variant="outlined"
                      size="small"
                    />

                    <div>
                      <MeasurementOptions 
                        id={index} 
                        name={element.name} 
                        options={element.options} 
                        handleOptionChange={that.handleOptionChange}
                      />
                      <Button 
                        size="small" 
                        color="primary" 
                        className={classes.button} 
                        onClick={that.handleRemoveOptionGroup(index)}
                      >
                        <DeleteIcon/>Remove Option Group
                      </Button>

                      <Button 
                        size="small" 
                        color="primary" 
                        className={classes.button} 
                        onClick={that.handleCopyOptionGroup(index)}
                      >
                        <FileCopyIcon/>Copy Option Group
                      </Button>
                    </div>
                  </FormGroup>
                )
              })}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" type="submit"><SaveAltIcon/>Save</Button>
              <Button size="small" color="primary" onClick={this.handleAddOptionGroup}><AddIcon/>Add Option Group</Button>
              <Button size="small" onClick={() => history.goBack()}><ClearIcon/>Cancel</Button>
            </CardActions>
          </form>
        </Card>
    </Modal>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(UseCaseditor);