import React from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import homeStyle from '../theme/homeStyle';

export default function ResponsiveDialog(props) {
  const classes = homeStyle();
  const fullScreen = useMediaQuery('(max-width:900px)');

  const handleDownload = () => {
    axios
      .get(props.url, {
        responseType: "blob"
      })
      .then((res) => {
        fileDownload(res.data, 'midweek.jpg');
      });
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{fullScreen ? "Swipe to View the Image": "Scroll to View the Image"}</DialogTitle>
        <DialogContent>
            <img className={classes.image} src={props.url} alt="selected"/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={e => handleDownload()} color="primary">
            Download
          </Button>
          <Button onClick={() => props.setOpen(false)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
