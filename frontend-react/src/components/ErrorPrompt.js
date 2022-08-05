import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function ErrorPrompt(props, ref) {
  const [open, setOpen] = useState(false)


  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    OpenError() {
      setOpen(true);
    }
  }), [])



  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Sorry, Something Went Wrong</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The website failed to Connect to Server. Please contact your Field Service Overseer about the issue. Thank you!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default forwardRef(ErrorPrompt)
