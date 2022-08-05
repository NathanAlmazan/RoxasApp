import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//icons
import TimelapseIcon from '@material-ui/icons/Timelapse';
import NoteIcon from '@material-ui/icons/Note';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import DateRangeIcon from '@material-ui/icons/DateRange';
import BookIcon from '@material-ui/icons/Book';
import MenuItem from '@material-ui/core/MenuItem';
import formStyle from '../theme/formStyles';

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

function get_year() {
    var date = new Date();
    date.setDate(date.getDate() - 15);
    var year = date.getFullYear()

    return year;
};

const year_set = [
    {value: get_year()-3, label: get_year()-3 },
    {value: get_year()-2, label: get_year()-2 },
    {value: get_year()-1, label: get_year()-1 },
    {value: get_year(), label: get_year() },
    {value: get_year()+1, label: get_year()+1 }
];

function ReportEdit(props) {
    const classes = formStyle();
    const superuser = window.sessionStorage.getItem('is_superuser');
    const report_info = props.record;
    const admin_user = props.admin;
    const [curr_Rep, setRep] = useState({
        key: '',
        publisher: '',
        month: '',
        year: '',
        hours: '',
        placements: '',
        videos: '',
        return_visit: '',
        bible_study: '',
        remarks: '', 
        auxiPr: false,
        late: false
    });
    const { key, publisher, month, year, hours, placements, videos, return_visit, bible_study, remarks, auxiPr, late } = curr_Rep;

    useEffect(() => {
        setRep(curr_Rep => ({ ...curr_Rep, month: report_info.month,
                                            year: report_info.year,
                                            hours: report_info.hours,
                                            placements: report_info.placements,
                                            videos: report_info.videos,
                                            return_visit: report_info.return_visit,
                                            bible_study: report_info.bible_study,
                                            remarks: report_info.remarks,
                                            publisher: report_info.publisher, 
                                            key: report_info.key,
                                            late: report_info.pending,
                                            auxiPr: report_info.auxiPr }));

    }, [report_info]);

    const Close = () => {
        props.handleClose(false);
    };

    const HandleMenuChange = e => {
        setRep({ ...curr_Rep, [e.target.name]: e.target.value });
    }

    const handleCheck = e => {
        setRep({ ...curr_Rep, auxiPr: e.target.checked });
    }

    const handlePending = (p) => {
        if (p) return null;
        else return false;
    }

   const report_modify = async (e) => {
       e.preventDefault();
       const pending = handlePending(late);
       const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
        };

        const body = JSON.stringify({ month, year, hours, placements, videos, return_visit, bible_study, pending, auxiPr });

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/report/month-sum/${key}/yr`, body, config);

            Close();
            props.refresh();
        } catch (err) {
            console.log(err.data);
        }
    }
       
    return (
        <Dialog
                open={props.openDialogue}
                onClose={() => props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <br/>
                <DialogTitle id="alert-dialog-title"> {publisher} </DialogTitle>
                <DialogActions>
                    <Grid container direction="column" justify="center" spacing={2} className={classes.dialogContent}>
                    <form onSubmit={e => report_modify(e)}>
                        <Grid item>
                            {admin_user ? (
                                <TextField
                                    fullWidth
                                    label=" Report Month "
                                    name='month'
                                    value={ month }
                                    margin="normal"
                                    select
                                    SelectProps={{
                                        classes: { icon: classes.icon },
                                        }}
                                    onChange={e => HandleMenuChange(e)}
                                    InputProps={{ endAdornment: <InputAdornment position="start">
                                        <DateRangeIcon />
                                    </InputAdornment>}}>
                                    {months.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    fullWidth
                                    label=" Report Month "
                                    name='month'
                                    disabled={true}
                                    value={ month }
                                    margin="normal"
                                    type="text"
                                    InputProps={{ endAdornment: <InputAdornment position="start">
                                        <DateRangeIcon />
                                    </InputAdornment>}}
                                />
                            )}
                            
                        </Grid>
                        <Grid item>
                            {admin_user ? (
                                <TextField
                                    fullWidth
                                    label=" Report Year "
                                    name='month'
                                    value={ year }
                                    margin="normal"
                                    select
                                    SelectProps={{
                                        classes: { icon: classes.icon },
                                        }}
                                    onChange={e => HandleMenuChange(e)}
                                    InputProps={{ endAdornment: <InputAdornment position="start">
                                        <DateRangeIcon />
                                    </InputAdornment>}}>
                                    {year_set.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    fullWidth
                                    label=" Report Year "
                                    name='month'
                                    disabled={true}
                                    value={ year }
                                    margin="normal"
                                    type="text"
                                    InputProps={{ endAdornment: <InputAdornment position="start">
                                        <DateRangeIcon />
                                    </InputAdornment>}}
                                />
                            )}
                            
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                error={false}
                                label="Hours"
                                name='hours'
                                value={ hours }
                                onChange={e => HandleMenuChange(e)}
                                margin="normal"
                                type="number"
                                InputProps={{ endAdornment: <InputAdornment position="start">
                                    <TimelapseIcon />
                                </InputAdornment>}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                error={false}
                                label="Placements"
                                name='placements'
                                value={ placements }
                                onChange={e => HandleMenuChange(e)}
                                margin="normal"
                                type="number"
                                InputProps={{ endAdornment: <InputAdornment position="start">
                                    <NoteIcon />
                                </InputAdornment>}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                error={false}
                                label="Videos"
                                name='videos'
                                value={ videos }
                                onChange={e => HandleMenuChange(e)}
                                margin="normal"
                                type="number"
                                InputProps={{ endAdornment: <InputAdornment position="start">
                                    <VideoLibraryIcon />
                                </InputAdornment>}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                error={false}
                                label="Return Visits"
                                name='return_visit'
                                value={ return_visit }
                                onChange={e => HandleMenuChange(e)}
                                margin="normal"
                                type="number"
                                InputProps={{ endAdornment: <InputAdornment position="start">
                                    <PeopleIcon />
                                </InputAdornment>}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                error={false}
                                label="Bible Study"
                                name='bible_study'
                                value={ bible_study }
                                onChange={e => HandleMenuChange(e)}
                                margin="normal"
                                type="number"
                                InputProps={{ endAdornment: <InputAdornment position="start">
                                    <BookIcon />
                                </InputAdornment>}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                disabled={true}
                                multiline
                                label="Remarks"
                                name='remarks'
                                value={ remarks }
                                margin="normal"
                                type="text"
                                InputProps={{ endAdornment: <InputAdornment position="start">
                                    <ChatIcon />
                                </InputAdornment>}}
                            />
                        </Grid>
                        {superuser === "true" && (
                            <Grid item>
                                <FormControl component="fieldset">
                                    <FormControlLabel
                                        control={<Checkbox checked={auxiPr} color="primary" onChange={handleCheck} name="auxiPr" />}
                                        label="Auxillary Pioneer"
                                    />
                                </FormControl>
                            </Grid>
                        )}
                        <br/>
                        <Grid item>
                            <Grid container direction="row" spacing={3} justify="flex-end">
                                <Button  color="primary" type="submit" autoFocus>
                                    Save
                                </Button>
                                <Button color="primary" onClick={() => props.handleClose(false)} >
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                        </form>
                    </Grid>
                </DialogActions>
                <br/>
                <br/>
        </Dialog>
    )
}

export default ReportEdit
