import React, { Component } from 'react';
import {
  TextField,
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  modal: {
    display: 'flex',
    outline: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 500,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
});

class UseCaseditor extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      measurementOptions: [{ name: "" }]
    };
  }

  componentDidMount() {
    const { useCase } = this.props

    if(useCase) {
      this.setState({name: useCase.name, measurementOptions: useCase.measurementOptions})
    }
  }

  handleUseCaseNameChange = evt => {
    this.setState({ name: evt.target.value });
  };

  handleMeasurementOptionChange = idx => evt => {
    const newOptions = this.state.measurementOptions.map((option, sidx) => {
      if (idx !== sidx) return option;
      return { ...option, name: evt.target.value };
    });

    this.setState({ measurementOptions: newOptions });
  };

  handleSubmit = evt => {
    const { onSave } = this.props
    const { id, name, measurementOptions } = this.state;

    let noneEmptyElements = measurementOptions.filter(function (element) {
      return element.name !== null && element.name !== "";
    });
    
    onSave(id, name, noneEmptyElements)

    evt.preventDefault();
  };

  handleAddMeasurementOption = () => {
    this.setState({
      measurementOptions: this.state.measurementOptions.concat([{ name: "" }])
    });
  };

  handleRemoveOption = idx => () => {
    this.setState({
      measurementOptions: this.state.measurementOptions.filter((s, sidx) => idx !== sidx)
    });
  };

  render() {
    const { classes, history} = this.props;
    
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
                placeholder="Use Case Name"
                label="Use Case Name"
                value={this.state.name}
                onChange={this.handleUseCaseNameChange}
                variant="outlined"
                size="small"
                autoFocus 
              />
                
              <Typography variant="subtitle1" >Measurement Options</Typography>

              {this.state.measurementOptions.map((option, idx) => (
                <div className="options">

                <TextField
                  required 
                  key={idx + 1}
                  type="text"
                  placeholder={`Option #${idx + 1} name`}
                  value={option.name}
                  onChange={this.handleMeasurementOptionChange(idx)}
                  variant="outlined"
                  size="small"
                  />
                  
                  <button
                    type="button"
                    onClick={this.handleRemoveOption(idx)}
                  >
                    <DeleteIcon/>
                  </button>
                </div>
              ))}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" type="submit"><SaveAltIcon/>Save</Button>
              <Button size="small" color="primary" type="button" onClick={this.handleAddMeasurementOption}><AddIcon/> Add</Button>
              <Button size="small" onClick={() => history.goBack()}>Cancel</Button>
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