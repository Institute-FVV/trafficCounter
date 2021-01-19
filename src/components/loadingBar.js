import React from 'react';
import {
  withStyles,
  CircularProgress
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    loadingBar: {
        fontSize: 100,
        position: 'fixed',
        top: "10vh",
        marginLeft: '50%'
    }
});

const LoadingBar = ({ classes }) => (
    <div className={ classes.root }>
    <CircularProgress className={ classes.loadingBar } size={ 100 }/>
  </div>
);

export default compose(
  withRouter,
  withStyles(styles),
)(LoadingBar);