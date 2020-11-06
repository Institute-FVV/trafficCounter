import React, { Component } from 'react';
import {
  TextField,
  withStyles,
  Button
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
});

class MeasurementOptions extends Component {
    constructor() {
        super();
        this.state = {
            id: 0,
            name: "", 
            options: [
                { name: ""}
            ]
        }
    }

    componentDidMount() {
        const { id, name, options } = this.props
        
        this.setState({
            id: id,
        })

        // only update options if something has provided, otherwise leave default
        if(options) {
          this.setState({
            name: name, 
            options: options
          })
        }
    }
    
    handleMeasurementOptionChange = idx => evt => {
        const { handleOptionChange } = this.props
        const newOptions = this.state.options.map((option, sidx) => {
            if (idx !== sidx) return option;
            return { ...option, name: evt.target.value };
        });
    
        this.setState({ options: newOptions });

        // execute parent function in usecaseEditor
        handleOptionChange(this.state.id, newOptions);
    };

    handleAddMeasurementOption = () => {
        this.setState({
            options: this.state.options.concat([{ name: "" }])
        });
    };
    
    handleRemoveOption = idx => () => {
        const { handleOptionChange } = this.props
        let tempOptions = this.state.options.filter((s, sidx) => idx !== sidx)

        this.setState({
            options: tempOptions
            }
        );

        handleOptionChange(this.state.id, tempOptions)
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                {this.state.options.map((option, idx) => (
                    <div className="options" key={`div-${idx + 1}`}>
                        <TextField
                            required 
                            key={this.idx + 1}
                            type="text"
                            placeholder={`Option #${idx + 1} name`}
                            value={option.name}
                            onChange={this.handleMeasurementOptionChange(idx)}
                            variant="outlined"
                            size="small"
                        />
                        
                        <Button 
                            size="small" 
                            color="primary" 
                            type="button"
                            onClick={this.handleRemoveOption(idx)}
                        >
                            <DeleteIcon/> Remove Option
                        </Button>

                        <Button 
                            size="small" 
                            color="primary" 
                            type="button" 
                            onClick={this.handleAddMeasurementOption}
                        >
                            <AddIcon/> Add Option
                        </Button>
                    </div>
                ))}
            </div>
        )
    }
}

export default compose(
    withRouter,
    withStyles(styles),
  )(MeasurementOptions);