import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function SuccessPrompt(props, ref) {
  const [open, setOpen] = useState(false);
  const post = props.post;


  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    OpenSuccess() {
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
        <DialogTitle id="alert-dialog-title">Success</DialogTitle>
        <DialogContent>
          {post ? (
          <DialogContentText id="alert-dialog-description">
            Your Bulletin Post was posted successfully.
          </DialogContentText>
          ) : (
          <DialogContentText id="alert-dialog-description">
            Successfully saved changes.
          </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default forwardRef(SuccessPrompt)
