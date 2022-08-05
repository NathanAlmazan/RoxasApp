import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import PublisherHistory from './PublisherHistory';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import AsyncSelect from 'react-select/async';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//themes
import formStyle from '../theme/formStyles';
//icons
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';

const ErrorPrompt = lazy(() => import('./ErrorPrompt'));
const Removed = lazy(() => import('./Removed'));
const SuccessPrompt = lazy(() => import('./SuccessPrompt'));


const search_publisher = async (inputValue) => {
    const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/publisher-search/${inputValue}`, config);
        const data = res.data

        const options = data.map(d => ({
            "value" : d.id,
            "label" : d.name,
            "group": d.group,
            "contact": d.contact,
            "email": d.email,
            "privilage": d.privilage,
            "birthday": d.birthday,
            "baptismal_date": d.baptismal_date
        }))

        return options;

    } catch(err) {
        console.log(err);
    }
    
};

const service_group = [
    {value: 1, label: 'Group 1' },
    {value: 2, label: 'Group 2' },
    {value: 3, label: 'Group 3' },
    {value: 4, label: 'Group 4' },
    {value: 5, label: 'Group 5' },
    {value: 6, label: 'Group 6' },
    {value: 7, label: 'Group 7' },
    {value: 8, label: 'Group 8' },
    {value: 9, label: 'Group 9' },
    {value: 10, label: 'Group 10' }
];

const PubPrivilage = [
    { value: 'Publisher', label: 'Publisher'},
    { value:'Regular Pioneer', label: 'Regular Pioneer'},
    { value: 'Unbaptized Publisher', label: 'Unbaptized Publisher'},
    { value: 'Auxillary Pioneer', label: 'Continuous Auxillary Pioneer'}
];

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function get_year() {
    var date = new Date();
    var m = date.getMonth();
    var date_year = new Date();
    var year = date_year.getFullYear();

    if (m === 0 ){
        year = date_year.getFullYear()-1;
    }

    return year;
};

const year_set = [
    {value: get_year()-3, label: get_year()-3 },
    {value: get_year()-2, label: get_year()-2 },
    {value: get_year()-1, label: get_year()-1 },
    {value: get_year(), label: get_year() },
    {value: get_year()+1, label: get_year()+1 }
];

function PublisherAdmin(props) {
    const classes = formStyle();
    const error_prompt = useRef();
    const [openRem, setOpenRem] = useState(false);
    const [removed, setPubRemoved] = useState(false);
    const success_prompt = useRef();
    const [pub_search, setPubSearch] = useState(null);
    const [openDialogue, setDialogue] = useState(false);
    const [delDialog, setDelDialog] = useState(false);
    const today = new Date();
    const date_today = `${today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()}`;
    const [currYear, setYear] = useState(today.getFullYear());
    const [selectedBirth, setSelectedBirth] = useState(new Date(date_today));
    const [selectedBaptismal, setSelectedBaptismal] = useState(new Date(date_today));
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        group: '',
        contact: '',
        email: '',
        privilage: '',
        birthday: null,
        baptismal_date: null
    });
    const { id, name, group, contact, email, privilage, birthday, baptismal_date } = formData;
    const pubName = props.name;

    useEffect(() => {
        async function getPublisher () {

            if (pubName) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
        
                try {
                    const data = await axios.post(`${process.env.REACT_APP_API_URL}/publishers/elder-search/${pubName}`, config);
                    const payload = data.data;

                    setFormData(formData => ({ ...formData, id: payload.id, name: payload.name, group: payload.group, contact: payload.contact, email: payload.email, privilage: payload.privilage, birthday:payload.birthday, baptismal_date: payload.baptismal_date }));
                    setSelectedBirth(payload.birthday);
                    setSelectedBaptismal(payload.baptismal_date);
                
                } catch (err) {
                    console.log(err);
                
                }
            }
        }

        getPublisher();
    }, [pubName])

    const handleSelect = e => {
        setFormData({ ...formData, id: e.value, name: e.label, group: e.group, contact: e.contact, email: e.email, privilage: e.privilage, birthday: e.birthday, baptismal_date: e.baptismal_date });
        setPubSearch(e);
        setSelectedBirth(formatDate(e.birthday));
        setSelectedBaptismal(formatDate(e.baptismal_date));
    };

    const onYearChange = e => {
        setYear(e.target.value);
    }

    const handleBirthdayChange = (date) => {
        setSelectedBirth(formatDate(date));
        setFormData({ ...formData, birthday: formatDate(date) });
    };
    
    const handleBaptismalChange = (date) => {
    setSelectedBaptismal(formatDate(date));
    setFormData({ ...formData, baptismal_date: formatDate(date) });
    };

    const clear = () => {
        setFormData({ ...formData,  id: '',
        name: '',
        group: '',
        contact: '',
        email: '',
        privilage: '',
        birthday: '',
        baptismal_date: '' });
        setSelectedBirth(new Date(date_today));
        setSelectedBaptismal(new Date(date_today));
        setPubSearch(null);
        setPubRemoved(false);
    };

    const HandleMenuChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setDialogue(false);
        clear();
    };

    const handleDelClose = () => {
        setDelDialog(false);
    }

    const DeletePublisher = async() => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/publishers/service-group/${id}`, config);
    
            setDelDialog(false);
            handleClose();
            success_prompt.current.OpenSuccess();
        } catch (err) {
            console.log(err);
            setDelDialog(false);
            handleClose();
            error_prompt.current.OpenError();
        }
    };

    const update_record = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ name, group, contact, email, privilage, birthday, baptismal_date });

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/publishers/publisher-search/${id}`, body, config);
    
            handleClose();
            success_prompt.current.OpenSuccess();
        } catch (err) {
            console.log(err);
            handleClose();
            error_prompt.current.OpenError();

        }
    };

    const add_record = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ name, group, contact, email, privilage, birthday, baptismal_date });

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/publishers/publisher-search/0`, body, config);
    
            handleClose();
            success_prompt.current.OpenSuccess();
        } catch (err) {
            console.log(err);
            handleClose();
            error_prompt.current.OpenError();
        }
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            setDialogue(true);
        } else {
            add_record();
        }
    };

    const setRemoved = pub => {
        setFormData({ ...formData, id: pub.id, name: pub.name, group: pub.group, contact: pub.contact, email: pub.email, birthday: pub.birthday, baptismal_date: pub.baptismal_date });
        setOpenRem(false);
        setPubRemoved(true);
    }

    return (
        <div>
            <form onSubmit={e => HandleSubmit(e)}>
                <Grid container direction="column" justify="center" spacing={2}>
                    <Grid item>
                        <Typography variant="body1" component="p" color="textSecondary">Search Publisher</Typography>
                    </Grid>
                    <Grid item>
                        <AsyncSelect className={classes.select} 
                                value={pub_search}
                                cacheOptions 
                                defaultOptions 
                                loadOptions={search_publisher} 
                                onChange={e => handleSelect(e)} />
                    </Grid>
                    
                    <Grid item>
                        <Grid container direction="row" justify="space-between" spacing={2}>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    error={false}
                                    required
                                    label=" Publisher Name "
                                    name='name'
                                    value={ name }
                                    onChange={e => HandleMenuChange(e)}
                                    margin="normal"
                                    type="text"
                                    InputProps={{ endAdornment: <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>}}
                                />
                            </Grid>

                            

                            <Grid item xs={12} md={4}>
                                <TextField
                                    required
                                    fullWidth
                                    error={false}
                                    label="Privilage"
                                    name='privilage'
                                    value={ privilage }
                                    onChange={e => HandleMenuChange(e)}
                                    margin="normal"
                                    select
                                    SelectProps={{
                                        classes: { icon: classes.icon },
                                        }}
                                    >
                                    {PubPrivilage.map((option) => (
                                        <MenuItem key={option.label} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
        
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" justify="space-between" spacing={2}>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    required
                                    fullWidth
                                    error={false}
                                    label="Group Number"
                                    name='group'
                                    value={ group }
                                    onChange={e => HandleMenuChange(e)}
                                    margin="normal"
                                    select
                                    SelectProps={{
                                        classes: { icon: classes.icon },
                                        }}
                                    >
                                    {service_group.map((option) => (
                                        <MenuItem key={option.label} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        fullWidth
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Birth Date"
                                        format="MM/dd/yyyy"
                                        value={selectedBirth}
                                        onChange={handleBirthdayChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        fullWidth
                                        margin="normal"
                                        id="datePickerDialog"
                                        label="Baptismal Date"
                                        format="MM/dd/yyyy"
                                        value={selectedBaptismal}
                                        onChange={handleBaptismalChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                    <Grid item >
                        <Grid container direction="row" justify="space-between" spacing={2}>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    error={false}
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

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    error={false}
                                    label=" Email "
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

                        </Grid>
                    </Grid>
                    <br/>
                    <Grid item xs={12} md={12}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Button type="submit" 
                                    fullWidth 
                                    size="large" 
                                    variant="contained"
                                    color="primary">Save Record</Button>   
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Button 
                                    fullWidth 
                                    size="large" 
                                    variant="outlined"
                                    onClick={clear}
                                    color="primary">Clear </Button>  
                            </Grid>
                            {props.superuser === "true" && (
                                <>
                                <Grid item xs={12} md={3}>
                                    <Button 
                                        fullWidth 
                                        size="large" 
                                        variant="outlined"
                                        onClick={e => setDelDialog(true)}
                                        color="primary">Remove Record
                                    </Button>  
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Button 
                                        fullWidth 
                                        size="large" 
                                        variant="outlined"
                                        onClick={e => setOpenRem(true)}
                                        color="primary">Show Removed
                                    </Button>  
                                </Grid>
                                </>
                            )}

                        </Grid>
                    </Grid>
                    <br />
                    { id && !removed && (
                        <Grid container justify="center" alignItems="center" direction="column" spacing={3}>
                            <Grid item xs={12} md={12} >
                                <Typography component="h1" align="center" variant="h5">Year Report</Typography>
                       
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    error={false}
                                    //helperText="Invalid"
                                    label="Year"
                                    name='group'
                                    value={ currYear }
                                    onChange={e => onYearChange(e)}
                                    margin="dense"
                                    select
                                    >
                                    {year_set.map((option) => (
                                        <MenuItem key={option.label} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <PublisherHistory id={id} year={currYear}/>
                            </Grid>
                        </Grid>
                    )}
        
                   <br/>
                   
                </Grid>
            </form>
            <Dialog
                open={openDialogue}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Verfication</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Do you want to Update {name} Profile or Add {name} as new Publisher?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={add_record} color="primary">
                    Add New Publisher
                </Button>
                <Button onClick={update_record} color="primary" autoFocus>
                    Update Publisher Profile
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={delDialog}
                onClose={handleDelClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Verfication</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this record?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button  onClick={DeletePublisher} color="primary">
                    Yes
                </Button>
                <Button onClick={handleDelClose} color="primary">
                    No
                </Button>
                </DialogActions>
            </Dialog>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <ErrorPrompt ref={error_prompt} />
            </Suspense>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <SuccessPrompt ref={success_prompt} post={false}/>
            </Suspense>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <Removed open={openRem} 
                    handleClose={close => setOpenRem(close)} 
                    handleRemoved={pub => setRemoved(pub)}/>
            </Suspense>
        </div>
    )
}

export default PublisherAdmin
