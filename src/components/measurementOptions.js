import React, { Component } from 'react';
import {
  TextField,
  withStyles,
  Button,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    iconLabel: {
        display: "inline"
    },
    options: {
        marginTop: theme.spacing(1.5)
    }
});

// Definition of Icons which can be used for buttons
// source https://material.io/resources/icons/?icon=arrow_downward&style=baseline
const ICONS = ["", "arrow_back", "arrow_forward", "arrow_upward", "arrow_downward", 
              "swap_horiz", "swap_vert", "accessible", "commute", "flight_land", 
              "flight_takeoff", "work", "login", "logout", "pedal_bike", "directions_walk", 
              "directions_car", "directions_bus", "directions_railway", "tram", "electric_bike", 
              "electric_car", "local_taxi", "electric_scooter", "two_wheeler", "north_east", "north_west", 
              "south_east", "south_west", "child_friendly", "elderly", "skateboarding"]

class MeasurementOptions extends Component {
    constructor() {
        super();
        
        this.state = {
            id: 0,
            name: "", 
            options: [
                { name: "", icon: "" }
            ],
        }
    }

    componentDidMount() {
        const { id, name, options } = this.props
        
        // update id, because this is always given
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
    
    // updates the measurement option on the given index with the given event value
    handleMeasurementOptionChange = idx => evt => {
        const { handleOptionChange } = this.props
        const newOptions = this.state.options.map((option, sidx) => {
            if (idx !== sidx) return option
            
            // check which information has been updated, either option name or option icon
            if(evt.target.name === "optionName") {
                return { name: evt.target.value, icon: option.icon }
            } else {
                return { name: option.name, icon: evt.target.value }
            }
        });
    
        this.setState({ options: newOptions });

        // execute parent function in usecaseEditor
        handleOptionChange(this.state.id, newOptions);
    };

    // add measurement option
    handleAddMeasurementOption = () => {
        this.setState({
            options: this.state.options.concat([{ name: "" }])
        });
    };
    
    // remove measurement option
    handleRemoveMeasurementOption = idx => () => {
        const { handleOptionChange } = this.props
        let tempOptions = this.state.options.filter((s, sidx) => idx !== sidx)

        this.setState({
            options: tempOptions
            }
        );

        // update parent state
        handleOptionChange(this.state.id, tempOptions)
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                {this.state.options.map((option, idx) => (
                    <div className={ classes.options } key={`div-${idx + 1}`}>
                        <TextField
                            required 
                            key={this.idx + 1}
                            name="optionName"
                            type="text"
                            label="Option name"
                            placeholder={`Option #${idx + 1} name`}
                            value={option.name}
                            onChange={this.handleMeasurementOptionChange(idx)}
                            variant="outlined"
                            size="small"
                        />

                        <InputLabel id="labelIconOption" className={classes.iconLabel }>Icon</InputLabel>
                        <Select
                            labelId="labelIconOption"
                            name="optionIcon"
                            id="optionIcon"
                            value={ option.icon }
                            onChange={ this.handleMeasurementOptionChange(idx) }
                        >
                        {
                            ICONS.map((icon, i) => (
                                <MenuItem key={ i } value={ icon }>
                                    { <Icon>{icon}</Icon> }
                                </MenuItem>
                            ))
                        }
                        </Select>
                        
                        <Button 
                            size="small" 
                            color="primary" 
                            type="button"
                            onClick={this.handleRemoveMeasurementOption(idx)}
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