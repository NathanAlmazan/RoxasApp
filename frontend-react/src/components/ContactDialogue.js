import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Collapse from '@material-ui/core/Collapse';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
//icons
import EmailIcon from '@material-ui/icons/Email';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import formStyle from '../theme/formStyles';

function ContactDialogue(props) {
    const classes = formStyle();
        const publisher_info = props.record;
        const no_report = props.report;
        const [collapse, setCollapse] = useState(false);
        const [curr_Pub, setPub] = useState({
            name: '',
            contact: '',
            email: '',
        });
        const { name, contact, email } = curr_Pub;

       useEffect(() => {

        const get_contact = async (value) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json', 
                }
            };
            const body = JSON.stringify({ value });
            
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/publishers/elder-search/${value}`, body, config);
                const data = res.data;
                setPub(curr_Pub => ({ ...curr_Pub, contact: data.contact, email: data.email }));
            } catch(err) {
                console.log(err);
            } 
        }

        if (!no_report) {
            setPub(curr_Pub => ({ ...curr_Pub, name: publisher_info.pub_name, contact: publisher_info.contact, email: publisher_info.email }));
        } else {
            setPub(curr_Pub => ({ ...curr_Pub, name: no_report }));
            get_contact(no_report);
        }

       }, [publisher_info, no_report]);

       const HandleMenuChange = e => {
            setPub({ ...curr_Pub, [e.target.name]: e.target.value });
       };

       const Close = () => {
            props.handleClose(false);
        };

        const handleCollapse = e => {
            setCollapse(true);
        }

       const update_record = async (e) => {
           e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ name, contact, email });

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/publishers/publisher-search/${publisher_info.id}`, body, config);
            Close();
        } catch (err) {
            console.log(err.data);
        }
    };
       
    return (
        <Dialog
                open={props.openDialogue}
                onClose={() => props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <br/>
                {!no_report ? (
                    <>
                    <DialogTitle id="alert-dialog-title">Your report {name} was Successfully Sent</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                       Please update your Contact Information for emergency purposes. Only Elders can view you Contact Information.
                    </DialogContentText>
                    </DialogContent>
                    </>
                ) : (
                    <>
                    <DialogTitle id="alert-dialog-title">{name}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                       You can remind {name} about his/her report using the updated contact information below.
                    </DialogContentText>
                    </DialogContent>
                    </>
                )}
                <DialogActions>
                    <Grid container direction="column" justify="center" spacing={2} className={classes.dialogContent}>
                    <form onSubmit={e => update_record(e)}>
                        
                            {!no_report ? (
                                <Collapse in={collapse} unmountOnExit>
                                    <Grid item>
                                        <TextField
                                            fullWidth
                                            label=" Contact Number "
                                            name='contact'
                                            value={ contact }
                                            onChange={e => HandleMenuChange(e)}
                                            margin="normal"
                                            type="text"
                                            inputProps={{maxLength: 12}}
                                            InputProps={{ endAdornment: <InputAdornment position="start">
                                                <ContactPhoneIcon />
                                            </InputAdornment>}}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                        fullWidth
                                        error={false}
                                        label="Email Address"
                                        name='email'
                                        value={ email }
                                        onChange={e => HandleMenuChange(e)}
                                        margin="normal"
                                        type="email"
                                        InputProps={{ endAdornment: <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>}}
                                    />
                                    </Grid>
                                </Collapse>

                            ) : (
                                <>
                                    <Grid item>
                                        <TextField
                                            fullWidth
                                            label=" Contact Number "
                                            name='contact'
                                            value={ contact }
                                            margin="normal"
                                            type="text"
                                            InputProps={{ endAdornment: <InputAdornment position="start">
                                                <ContactPhoneIcon />
                                            </InputAdornment>}}
                                        />
                                    </Grid>
                                        <Grid item>
                                            <TextField
                                            fullWidth
                                            label="Email Address"
                                            name='email'
                                            value={ email }
                                            margin="normal"
                                            type="email"
                                            InputProps={{ endAdornment: <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>}}
                                        />
                                    </Grid>
                                </>
                            )}
                            
                        <br/>
                        <Grid item>
                            <Grid container direction="row" spacing={3} justify="flex-end">
                                {!no_report ? (
                                    <>
                                    <Button  color="primary" autoFocus onClick={e => handleCollapse(e)} disabled={collapse}>
                                        Update
                                    </Button>
                                    <Button  color="primary" type="submit" disabled={!collapse}>
                                        Save Changes
                                    </Button>
                                    <Button color="primary" onClick={() => props.handleClose(false)} >
                                        Cancel
                                    </Button>
                                    </>
                                ) : (
                                    <Button color="primary" onClick={() => props.handleClose(false)} >
                                        Close
                                    </Button>
                                )}
                                
                            </Grid>
                        </Grid>
                        </form>
                    </Grid>
                </DialogActions>
                <br/>
        </Dialog>
    )
}

export default ContactDialogue
