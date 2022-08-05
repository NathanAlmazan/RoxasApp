import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
//icons
import homeStyle from '../theme/homeStyle';
import ReportTable from './ReportTable';

const MonthSummary = lazy(() => import('../components/MonthSummary'));

function get_month(){
    var date = new Date()
    date.setDate(date.getDate() - 15);
    var mm = date.getMonth();
    var month_yr = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const curr_month = month_yr[mm];

    return curr_month
};

function get_year() {
    var date = new Date();
    date.setDate(date.getDate() - 15);
    var year = date.getFullYear()

    return year;
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

const year_set = [
    {value: get_year()-3, label: get_year()-3 },
    {value: get_year()-2, label: get_year()-2 },
    {value: get_year()-1, label: get_year()-1 },
    {value: get_year(), label: get_year() },
    {value: get_year()+1, label: get_year()+1 }
];


function Admin(props) {
    const classes = homeStyle();
    const initial_group = props.group;
    const refresh_summary = useRef();
    const initial_month = get_month();
    const initial_year = get_year();
    const [reportData, setReportData] = useState([]);
    const [noreport_data, setNoReport_Data] = useState([]);
    
    const [search, setSearch] = useState({
        month: '',
        group: '',
        year: ''
    });
    const { month, group, year } = search;

    //retrieve report month.
    const set_date = e => {
        setSearch({ ...search, month: e.target.value });
        set_data(e.target.value);
        
    };


    //retrieve report group
    const set_group = e => {
        setSearch({ ...search, group: e.target.value });
        set_data_group(e.target.value);
        
    };

    const refresh = async () => {
        refresh_summary.current.getSummary();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/save-report/${group}/${month}/${year}`, config);
            const data = res.data

            const reports = data.map(d => ({
                "key": d.id,
                "publisher" : d.publisher_name,
                "hours" : d.hours,
                "placements" : d.placements,
                "videos" : d.videos,
                "return_visit" : d.return_visit,
                "bible_study" : d.bible_study,
                "month": d.month,
                "year": d.year,
                "remarks": d.remarks,
                "auxiPr": d.auxiPr,
                "pending": d.pending
            }))
        
            setReportData(reports);

        } catch(err) {
            console.log(err);
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/no-report/${group}/${month}/${year}`, config);
            const data = res.data
        
            setNoReport_Data(data);

        } catch(err) {
            console.log(err);
        }

    };

    const set_data_group = async (value) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/save-report/${value}/${month}/${year}`, config);
            const data = res.data

            const reports = data.map(d => ({
                "key": d.id,
                "publisher" : d.publisher_name,
                "hours" : d.hours,
                "placements" : d.placements,
                "videos" : d.videos,
                "return_visit" : d.return_visit,
                "bible_study" : d.bible_study,
                "month": d.month,
                "year": d.year,
                "remarks": d.remarks,
                "auxiPr": d.auxiPr,
                "pending": d.pending
            }))
        
            setReportData(reports);

        } catch(err) {
            console.log(err);
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/no-report/${value}/${month}/${year}`, config);
            const data = res.data
        
            setNoReport_Data(data);

        } catch(err) {
            console.log(err);
        }

    };

    //year change
    const set_year = e => {
        setSearch({ ...search, year: e.target.value });
        set_data_year(e.target.value);
    };

    const set_data = async (value) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/save-report/${group}/${value}/${year}`, config);
            const data = res.data

            const reports = data.map(d => ({
                "key": d.id,
                "publisher" : d.publisher_name,
                "hours" : d.hours,
                "placements" : d.placements,
                "videos" : d.videos,
                "return_visit" : d.return_visit,
                "bible_study" : d.bible_study,
                "month": d.month,
                "year": d.year,
                "remarks": d.remarks,
                "auxiPr": d.auxiPr,
                "pending": d.pending
            }))
        
            setReportData(reports);

        } catch(err) {
            console.log(err);
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/no-report/${group}/${value}/${year}`, config);
            const data = res.data
        
            setNoReport_Data(data);

        } catch(err) {
            console.log(err);
        }

    };


    const set_data_year = async (value) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json' 
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/save-report/${group}/${month}/${value}`, config);
            const data = res.data

            const reports = data.map(d => ({
                "key": d.id,
                "publisher" : d.publisher_name,
                "hours" : d.hours,
                "placements" : d.placements,
                "videos" : d.videos,
                "return_visit" : d.return_visit,
                "bible_study" : d.bible_study,
                "month": d.month,
                "year": d.year,
                "remarks": d.remarks,
                "auxiPr": d.auxiPr,
                "pending": d.pending
            }))
        
            setReportData(reports);

        } catch(err) {
            console.log(err);
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/no-report/${group}/${month}/${value}`, config);
            const data = res.data
        
            setNoReport_Data(data);

        } catch(err) {
            console.log(err);
        }

    };

    useEffect(() => {
       
        setSearch(search => ({ ...search, month: initial_month, group: initial_group, year: initial_year }));
   
        const get_data = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            };
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/save-report/${initial_group}/${initial_month}/${initial_year}`, config);
                const data = res.data
    
                const reports = data.map(d => ({
                    "key": d.id,
                    "publisher" : d.publisher_name,
                    "hours" : d.hours,
                    "placements" : d.placements,
                    "videos" : d.videos,
                    "return_visit" : d.return_visit,
                    "bible_study" : d.bible_study,
                    "month": d.month,
                    "year": d.year,
                    "remarks": d.remarks,
                    "auxiPr": d.auxiPr,
                    "pending": d.pending
                }))
            
                setReportData(reportData => (reports));
    
            } catch(err) {
                console.log(err);
            }
    
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/no-report/${initial_group}/${initial_month}/${initial_year}`, config);
                const data = res.data
            
                setNoReport_Data(noreport_data => (data));
    
            } catch(err) {
                console.log(err);
            }
    
        };

        get_data();
        
    }, [initial_group, initial_year, initial_month]);


    return (
        <Box >
            <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
                {props.superuser === "true" && ( <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        error={false}
                        //helperText="Invalid"
                        label="Group Number"
                        name='group'
                        value={ group }
                        onChange={e => set_group(e)}
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
                </Grid>)}
               
                <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        error={false}
                        //helperText="Invalid"
                        label="Month"
                        name='month'
                        value={ month }
                        onChange={e => set_date(e)}
                        margin="normal"
                        select
                        SelectProps={{
                            classes: { icon: classes.icon },
                            }}
                        >
                        {months.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label} {option.year}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        error={false}
                        //helperText="Invalid"
                        label="Year"
                        name='year'
                        value={ year }
                        onChange={e => set_year(e)}
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
            </Grid>
            <ReportTable data={reportData} no_data={noreport_data} superuser={Boolean(props.superuser === "true")} refresh_comp={refresh} />
           
            {props.superuser === "true" && (
                <Suspense fallback={<div>Loading, Please wait...</div>}>
                     <br/>
                    <MonthSummary ref={refresh_summary} CurrMonth={month} CurrYear={year} />
                </Suspense>
            )}
           

        </Box>
    )
};


export default Admin;
