import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
//themes
import formStyle from '../theme/formStyles';
//material-ui components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
//material-ui icons
import TimelapseIcon from '@material-ui/icons/Timelapse';
import NoteIcon from '@material-ui/icons/Note';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import DateRangeIcon from '@material-ui/icons/DateRange';
import BookIcon from '@material-ui/icons/Book';
import SendIcon from '@material-ui/icons/Send';
import Select from 'react-select';

const DuplicateReport = lazy(() => import('./DuplicateReport'));
const ErrorPrompt = lazy(() => import('./ErrorPrompt'));
const ContactDialogue = lazy(() => import('./ContactDialogue'));

const months = [
    {value: 'january', label: 'January' },
    {value: 'february', label: 'February' },
    {value: 'march', label: 'March' },
    {value: 'april', label: 'April' },
    {value: 'may', label: 'May' },
    {value: 'june', label: 'June' },
    {value: 'july', label: 'July' },
    {value: 'august', label: 'August' },
    {value: 'september', label: 'September' },
    {value: 'october', label: 'October' },
    {value: 'november', label: 'November' },
    {value: 'december', label: 'December' }
];

function Report({user}) {
    //styles
    const classes = formStyle();
    const [pending, setPending] = useState(false);
    const [pubOptions, setPubOptions] = useState([]);
    const [currentMonth, setCurrentM] = useState({
        current: '',
        next: ''
    });
    const [Show, setShow] = useState(false);
    const [errorDialog, setError] = useState(false);
    const [DuplicateRep, setDuplicateReport] = useState(false);
    const [sentReport, setSentReport] = useState(false);
    const [selectValue, setSelectValue] = useState(null);
    const [publisher_info, setPubInfo] = useState({
        id: '',
        pub_name: '',
        contact: '',
        email: ''
    });

    //data and state
    const [reportData, setReportData] = useState({
        group: '', 
        publisher: '',
        name: '',
        month: '',
        year: '',
        hours: '',
        placements: '',
        videos: '',
        return_visit: '',
        bible_study: '',
        remarks: ''

    });
    const { group, publisher, month, year, hours, placements, videos, return_visit, bible_study, remarks } = reportData;

    const clear_data = () => {
        setReportData({ ...reportData,
            group: '', 
            publisher: '',
            name: '',
            hours: '',
            placements: '',
            videos: '',
            return_visit: '',
            bible_study: '',
            remarks: ''
        });
        setSelectValue(null);
    };

    useEffect(() => {
        //get current month
        var date = new Date()
        date.setDate(date.getDate() - 15);
        var mm = date.getMonth();
        var yr = date.getFullYear()
        const month_yr = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const curr_month = month_yr[mm];
        const next_month = month_yr[mm+1];
        setReportData(reportData => ({ ...reportData, month: curr_month, year: yr }));
        setCurrentM(currentMonth => ({ ...currentMonth, current: curr_month, next: next_month }));

        const today = new Date();
        const day_today = today.getDate();
        setPending(pending => (Boolean( day_today > 10 || day_today < 27)));
    }, []);

    //store user input
    const textfieldChange = e => setReportData({ ...reportData, [e.target.name]: e.target.value });

    const handleMonthChange = e => {
        setReportData({ ...reportData, month: e.target.value });
        if (e.target.value !== currentMonth.current && e.target.value !== currentMonth.next) {
            setPending(true);
        } else {
            setPending(false);
        }
    }

    //set publisher
    const handleSelect = (e) => {
        setSelectValue(e);
        setReportData({...reportData, group: e.value, publisher: e.publisher, name: e.label });
        setPubInfo({ ...publisher_info, pub_name: e.label, contact: e.contact, email: e.email, id: e.publisher });
    }

    useEffect(() => {
        const search_publisher = async (group_value) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            };
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/service-group/${group_value}`, config);
                const data = res.data
        
                const options = data.map(d => ({
                    "value" : d.group,
                    "label" : d.name,
                    "publisher": d.id,
                    "contact": d.contact, 
                    "email": d.email
                }))
        
                setPubOptions(pubOptions => (options));
        
            } catch(err) {
                console.log(err);
            }
            
        }
        if (user) {
            search_publisher(user.group);
        }
    }, [user])

    //submit form
    const onSubmit = async (e) => {
        e.preventDefault();
        setSentReport(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ group, publisher, month, year, hours, placements, videos, return_visit, bible_study, remarks, pending });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/report/save-report/${publisher}/${month}/yr`, body, config);
            const data = res.data;

           if (data.alert === "report already exist") {
                setDuplicateReport(true);
           } else {
                setShow(true);
           };

            clear_data(); 
            setSentReport(false);
            
        } catch (err) {
            setError(true);
            setSentReport(false);
        }
    };

    return (
        <Box
        sx={{
            marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography component="h1" variant="h5" className={classes.h2}>
          Field Service Report
        </Typography>
        <br/>
            <form onSubmit={ e => onSubmit(e) }>
                <Grid container spacing={1} direction="column" alignItems="flex-start">
                    <Grid item>
                        <Typography variant="body1" component="p" color="textSecondary">Please select your Name</Typography>
                    </Grid>
                    <Grid item className={classes.textbox_sm}>
                        <Select
                            className={classes.select}
                            value={selectValue}
                            onChange={e => handleSelect(e)}
                            isClearable={true}
                            isSearchable={true}
                            options={pubOptions}
                            />
                    </Grid>
                    <Grid item className={classes.textbox}>
                        <TextField
                            className={classes.textarea}
                            error={false}
                            //helperText="Invalid"
                            label="Month"
                            name='month'
                            value={ month }
                            onChange={e => handleMonthChange(e)}
                            margin="normal"
                            select
                            SelectProps={{
                                classes: { icon: classes.icon },
                                }}
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <DateRangeIcon />
                            </InputAdornment>}}>
                            {months.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            className={classes.textarea}
                            error={false}
                            required
                            //helperText="Invalid"
                            label="Hours"
                            name='hours'
                            value={ hours }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            type="number"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <TimelapseIcon />
                            </InputAdornment>}}/>
                    </Grid>
                    <Grid item className={classes.textbox}>
                        <TextField
                            className={classes.textarea}
                            error={false}
                            required
                            //helperText="Invalid"
                            label="Placements"
                            name='placements'
                            value={ placements }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            type="number"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <NoteIcon />
                            </InputAdornment>}}/>
                        <TextField
                            className={classes.textarea}
                            error={false}
                            required
                            //helperText="Invalid"
                            label="Videos"
                            name='videos'
                            value={ videos }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            type="number"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <VideoLibraryIcon />
                            </InputAdornment>}}/>
                    </Grid>
                    <Grid item className={classes.textbox}>
                        <TextField
                            className={classes.textarea}
                            error={false}
                            required
                            //helperText="Invalid"
                            label="Return Visit"
                            name='return_visit'
                            value={ return_visit }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            type="number"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <PeopleIcon />
                            </InputAdornment>}}/>
                        <TextField
                            className={classes.textarea}
                            error={false}
                            required
                            //helperText="Invalid"
                            label="Bible Study"
                            name='bible_study'
                            value={ bible_study }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            type="number"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <BookIcon />
                            </InputAdornment>}}/>
                    </Grid>
                    <Grid item className={classes.textbox}>
                        <TextField
                            className={classes.textarea_sm}
                            error={false}
                            //helperText="Invalid"
                            multiline
                            label="Remarks"
                            name='remarks'
                            value={ remarks }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            type="number"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <ChatIcon />
                            </InputAdornment>}}/>
                    </Grid>
                </Grid>
                <Grid container className={classes.submit}>
                    <Button type="submit" 
                                fullWidth 
                                disabled={sentReport}
                                size="large" 
                                variant="contained"
                                endIcon={<SendIcon />}
                                color="primary">Send Report</Button>
                </Grid>
            </form>
            {Show && (
                <Suspense fallback={<div>Loading, Please wait...</div>}>
                    <ContactDialogue openDialogue={Show} handleClose={Show => setShow(Show)} record={publisher_info} report={null} />
                </Suspense>
            )}
            {DuplicateRep && (
                <Suspense fallback={<div>Loading, Please wait...</div>}>
                    <DuplicateReport reset={DuplicateRep => setDuplicateReport(DuplicateRep)} open={DuplicateRep} />
                </Suspense>
            )}
            {errorDialog && (
                <Suspense fallback={<div>Loading, Please wait...</div>}>
                    <ErrorPrompt reset={errorDialog => setError(errorDialog)} open={errorDialog} />
                </Suspense>
            )}
            
        </Box>

    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps)(Report);
