import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import homeStyle from '../theme/homeStyle';

function Removed(props) {
    const classes = homeStyle();
    const [removed, setRemoved] = useState([]);

    useEffect(() => {
        const get_removed = async () => {
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              }
          };
          try {
              const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/inactive/pk`, config);
              const payload = res.data;
            
              setRemoved(removed => (payload));
  
          } catch(err) {
              console.log(err);
          }
      };
  
      if (props.open) {
        get_removed();
      }
  
      }, [props]);

    return (
    <Dialog onClose={() => props.handleClose(false)} aria-labelledby="pioneer-dialog" open={props.open}>
      <DialogTitle id="simple-dialog-title">Removed Publishers</DialogTitle>
      <List>
        {removed.map((pub) => (
            <ListItem key={pub.id} onClick={() => props.handleRemoved(pub)}>
              <ListItemAvatar>
                <Avatar color="primary" className={classes.avatar}>
                  <HighlightOffIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={pub.name} />
            </ListItem>
          )
        )}
      </List>
    </Dialog>
    )
}

export default Removed
