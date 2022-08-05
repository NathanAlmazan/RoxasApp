import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
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
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const ErrorPrompt = lazy(() => import('./ErrorPrompt'));
const SuccessPrompt = lazy(() => import('./SuccessPrompt'));


const search_elder = async (inputValue) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json' 
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/elder-search/${inputValue}`, config);
        const data = res.data

        const options = data.map(d => ({
            "value" : d.id,
            "label" : d.name
        }))

        return options;

    } catch(err) {
        console.log(err);
    }
    
}

const uploadFor = [
    { value:'Announcement', label: 'Announcement'},
    { value: 'Midweek Meeting Schedule', label: 'Midweek Meeting Schedule'},
    { value: 'Field Service Schedule', label: 'Field Service Schedule'},
    { value: 'Weekend Meeting Schedule', label: 'Weekend Meeting Schedule'}
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

function Post() {
    const classes = formStyle();
    const [elderSelect, setElderSelect] = useState(null);
    const [nameError, setNameError] = useState(false);
    const error_prompt = useRef();
    const success_prompt = useRef();
    //get date
    const today = new Date();
    const date_today = `${today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()}`;

    const [selectedDate, setSelectedDate] = useState(new Date(date_today));
    const [postForm, setFormData] = useState({
        name: '',
        uploaded_by: '',
        meeting_date: '',
        uploaded_for: '',
        image: null
    });
    const { name, uploaded_by, meeting_date, uploaded_for, image } = postForm;

    useEffect(() => {
        setFormData(postForm => ({ ...postForm, meeting_date: date_today }));
    }, [date_today]);

    const clearData = () => {
        setFormData({
            name: '',
            uploaded_by: '',
            meeting_date: '',
            uploaded_for: '',
            image: null
        });
        setElderSelect(null);
        setSelectedDate(new Date(date_today));
    }

    const handleSelect = e => {
        setFormData({ ...postForm, uploaded_by: e.value, name: e.label});
        setElderSelect(e);
        setNameError(false);
    }

    const handleDateChange = (date) => {
        setSelectedDate(formatDate(date));
        setFormData({ ...postForm, meeting_date: formatDate(date) });
      };

    const handleImageChange = (e) => {
        setFormData({ ...postForm, image: e.target.files[0] });
    };

    const textfieldChange = (e) => {
        setFormData({ ...postForm, uploaded_for: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name === '') {
            setNameError(true);
        } else {
            let form_data = new FormData();
            form_data.append('image', image, image.name);
            form_data.append('uploaded_by', uploaded_by);
            form_data.append('meeting_date', meeting_date);
            form_data.append('uploaded_for', uploaded_for);
            let url = `${process.env.REACT_APP_API_URL}/bulletin/post`;
            axios.post(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
            })
                .then(res => {
                clearData();
                success_prompt.current.OpenSuccess();
                })
                .catch(err => {console.log(err);
                            error_prompt.current.OpenError();
                            clearData(); })
        }
        
    };

    return (
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="body1" component="p" color="textSecondary">Please Type Your Name</Typography>
                    </Grid>
                    <Grid item>
                        <AsyncSelect className={classes.select} value={elderSelect} cacheOptions defaultOptions loadOptions={search_elder} onChange={e => handleSelect(e)} />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            error={nameError}
                            helperText={nameError && "Name of Uploader is Required"}
                            disabled={true}
                            label="Upload By"
                            name='uploaded_by'
                            value={ name }
                            margin="normal"
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <AccountCircleIcon />
                            </InputAdornment>}} 
                            />
                    </Grid>
                    <Grid item>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                fullWidth
                                margin="normal"
                                id="date-picker-dialog"
                                label="Post Date"
                                format="MM/dd/yyyy"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            error={false}
                            required
                            label="Upload For"
                            name='uploaded_for'
                            value={ uploaded_for }
                            onChange={e => textfieldChange(e)}
                            margin="normal"
                            select
                            SelectProps={{
                                classes: { icon: classes.icon },
                                }}
                            InputProps={{ endAdornment: <InputAdornment position="start">
                                <PostAddIcon />
                            </InputAdornment>}}>
                            {uploadFor.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))} 
                        </TextField>
                    </Grid>
                    <Grid item>
                    <FormControl fullWidth margin="normal">
                        <Input type="file"
                            id="image-upload"
                            accept="image/png, image/jpeg, image/jpg"
                            fullWidth 
                            endAdornment={<AttachFileIcon />}
                            onChange={e => handleImageChange(e)} 
                            required/>
                    </FormControl>
                    </Grid>
                    <Grid item>
                    <Button type="submit" 
                                fullWidth 
                                size="large" 
                                variant="contained"
                                color="primary">Post to Bulletin</Button>
                    </Grid>
                </Grid>
            </form>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <ErrorPrompt ref={error_prompt} />
            </Suspense>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <SuccessPrompt ref={success_prompt} post={true}/>
            </Suspense>
        </div>
    )
}

export default Post
