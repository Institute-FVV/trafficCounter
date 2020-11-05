import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';

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
    marginTop: theme.spacing(10),
  },
});

const Help = ({ classes, history }) => (
  <Modal
    className={classes.modal}
    onClose={() => history.goBack()}
    open
  >
    <Card className={`${classes.modalCard} ${classes.marginTop}`}>
        <CardContent className={classes.modalCardContent}>
          <Typography>
            Das ist ein schöner Hilfstext für dieses fantastische App
          </Typography>
        </CardContent>          
        <CardActions>
          <Button size="small" onClick={() => history.goBack()}><ClearIcon/>Close</Button>
        </CardActions>
    </Card>
  </Modal>
);

export default compose(
  withRouter,
  withStyles(styles),
)(Help);