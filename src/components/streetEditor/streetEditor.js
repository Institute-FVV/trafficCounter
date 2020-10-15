import React, { Component, Fragment } from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button
} from '@material-ui/core';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  modal: {
    display: 'flex',
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

class StreetEditor extends Component {
  constructor() {
    super();
    this.state = {
      streetName: "",
      options: [{ name: "" }]
    };
  }

  componentDidMount() {
    const { street } = this.props

    if(street) {
      this.setState({streetName: street.streetName})
    }
  }

  handleStreetNameChange = evt => {
    this.setState({ streetName: evt.target.value });
  };

  handleOptionChange = idx => evt => {
    const newOptions = this.state.options.map((option, sidx) => {
      if (idx !== sidx) return option;
      return { ...option, name: evt.target.value };
    });

    this.setState({ options: newOptions });
  };

  handleSubmit = evt => {
    const { onSave } = this.props
    const { streetName, options } = this.state;

    onSave(this.state)
    console.log(streetName, options)

    evt.preventDefault();
  };

  handleAddShareholder = () => {
    this.setState({
      options: this.state.options.concat([{ name: "" }])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      options: this.state.options.filter((s, sidx) => idx !== sidx)
    });
  };

  render() {
    const { classes, street, onSave, history} = this.props;
    
    return (
      <Modal
      className={classes.modal}
      onClose={() => history.goBack()}
      open
      >
        <Card className={classes.modalCard}>
          <form onSubmit={this.handleSubmit}>
            <CardContent className={classes.modalCardContent}>
              <input
                type="text"
                placeholder="Streetname"
                value={this.state.streetName}
                onChange={this.handleStreetNameChange}
              />

              <h4>Options</h4>

              {this.state.options.map((option, idx) => (
                <div className="options">
                  <input
                    type="text"
                    placeholder={`Option #${idx + 1} name`}
                    value={option.name}
                    onChange={this.handleOptionChange(idx)}
                  />
                  <button
                    type="button"
                    onClick={this.handleOptionChange(idx)}
                    className="small"
                  >
                    -
                  </button>
                </div>
              ))}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" type="submit">Save</Button>
              <Button size="small" color="primary" type="button" onClick={this.handleAddShareholder}>Add</Button>
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
)(StreetEditor);