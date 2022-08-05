import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import homeStyle from '../theme/homeStyle';

function Pioneer(props) {
    const classes = homeStyle();
    const reg_pr = props.pioneer;
    const [pioneer, setPioneer] = useState([]);
    const [NoReport, setNoRp] = useState([]);

    useEffect(() => {
      const get_pioneers = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/pioneers/${reg_pr ? 'reg' : 'auxi'}/${props.curr_month}/${props.curr_year}`, config);
            const payload = res.data;
          
            setPioneer(pioneer => (payload.Reported));
            setNoRp(NoReport => (payload.Not_Reported));

        } catch(err) {
            console.log(err);
        }
    };

    if (props.open) {
      get_pioneers();
    }

    }, [props, reg_pr]);



    return (
    <Dialog onClose={() => props.handleClose(false)} aria-labelledby="pioneer-dialog" open={props.open}>
      <DialogTitle id="simple-dialog-title">{reg_pr ? "Regular Pioneers" : "Auxillary Pioneers"}</DialogTitle>
      <List>
        {!pioneer ? (<div>Loading...</div> ) : (
          pioneer.map((name) => (
            <ListItem key={name} >
              <ListItemAvatar>
                <Avatar color="primary" className={classes.avatar}>
                  <CheckCircleOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItem>
          ))
        )}
      
        {!NoReport ? (<div>Loading...</div> ) : (
          NoReport.map((name) => (
            <ListItem key={name} >
              <ListItemAvatar>
                <Avatar color="primary" className={classes.avatar}>
                  <HourglassEmptyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItem>
          ))
        )}
      </List>
    </Dialog>
    )
}

export default Pioneer
