import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import AsyncSelect from 'react-select/async';
//themes
import formStyle from '../theme/formStyles';

const ErrorPrompt = lazy(() => import('./ErrorPrompt'));
const SuccessPrompt = lazy(() => import('./SuccessPrompt'));

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
    var m = date.getMonth();
    var date_year = new Date();
    var year = date_year.getFullYear();

    if (m === 0 ){
        year = date_year.getFullYear()-1;
    }

    return year;
};

const year_set = [
    {value: get_year(), label: get_year() },
    {value: get_year()+1, label: get_year()+1 },
    {value: get_year()-1, label: get_year()+2 }
];

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

function get_month(){
    var date = new Date()
    date.setMonth(date.getMonth()-1);
    var mm = date.getMonth();
    var month_yr = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const curr_month = month_yr[mm];

    return curr_month
};

function AuxillaryPioneer() {
    const classes = formStyle();
    const [pub_search, setPubSearch] = useState(null);
    const [cont, setCont] = useState(false);
    const error_prompt = useRef();
    const success_prompt = useRef();
    const [formData, setFormData] = useState({
        publisher: 0,
        month: '',
        year: ''
    });

    useEffect(() => {
        setFormData(formData => ({ ...formData, month: get_month(), year: get_year() }))
    }, [])

    const { publisher, month, year } = formData;

    const handleSelect = e => {
        setFormData({ ...formData, publisher: e.value });
        if (e.privilage === "Auxillary Pioneer") setCont(true);
        setPubSearch(e);
    };

    const HandleMenuChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const clear = () => {
        setFormData({ ...formData, publisher: 0, month: '', year: '' });
        setPubSearch(null);
    }

    const setContinous = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }
        };
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/report/pub-report/${publisher}/${cont}`, config);
            success_prompt.current.OpenSuccess();
            clear()
        } catch(err) {
            console.log(err);
            error_prompt.current.OpenError();
        }
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }
        };
        const body = JSON.stringify({ publisher, month, year });
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/report/pub-report/${month}/${year}`, body, config);
            success_prompt.current.OpenSuccess();
            clear();
    
        } catch(err) {
            console.log(err);
            error_prompt.current.OpenError();
        }
    };

    return (
        <div>
             <form onSubmit={e => HandleSubmit(e)}>
                <Grid container direction="column" justify="center" spacing={2}>
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

                            <Grid item xs={12} md={4}>
                                <TextField
                                    required
                                    fullWidth
                                    error={false}
                                    label="Month"
                                    name='month'
                                    value={ month }
                                    onChange={e => HandleMenuChange(e)}
                                    margin="normal"
                                    select
                                    SelectProps={{
                                        classes: { icon: classes.icon },
                                        }}
                                    >
                                    {months.map((option) => (
                                        <MenuItem key={option.label} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                        required
                                        fullWidth
                                        error={false}
                                        label="Year"
                                        name='year'
                                        value={ year }
                                        onChange={e => HandleMenuChange(e)}
                                        margin="normal"
                                        select
                                        SelectProps={{
                                            classes: { icon: classes.icon },
                                            }}
                                        >
                                        {year_set.map((option) => (
                                            <MenuItem key={option.label} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Grid>
                            <br/>
                            <Grid item xs={12} md={4}>
                                {cont ? (
                                    <Button 
                                        fullWidth 
                                        size="large" 
                                        variant="outlined"
                                        onClick={setContinous}
                                        color="primary">Stop Continuous
                                    </Button>
                                ):(
                                    <Button 
                                        fullWidth 
                                        size="large" 
                                        variant="contained"
                                        onClick={setContinous}
                                        color="primary">Set Continuous
                                    </Button>  
                                )}    
                            </Grid>
                            
                        </Grid>
                    </Grid>
                    <br/>
                    <Grid item xs={12} md={12}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Button type="submit" 
                                    fullWidth 
                                    size="large" 
                                    variant="contained"
                                    color="primary">Save</Button>  
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Button 
                                    fullWidth 
                                    size="large" 
                                    variant="outlined"
                                    onClick={clear}
                                    color="primary">Clear </Button>  
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </form>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <ErrorPrompt ref={error_prompt} />
            </Suspense>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
                <SuccessPrompt ref={success_prompt} post={false}/>
            </Suspense>

        </div>
    )
}

export default AuxillaryPioneer
