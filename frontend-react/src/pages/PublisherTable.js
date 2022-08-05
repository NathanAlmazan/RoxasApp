import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import { Element } from 'react-scroll';
import EditIcon from '@material-ui/icons/Edit';
import PublisherAdmin from '../components/PublisherAdmin';
import CheckInactive from '../components/CheckInactive';
import { makeStyles } from '@material-ui/core/styles';
import AuxillaryPioneer from '../components/AuxillaryPioneer';

const rowStyle = makeStyles((theme) => ({
    row: {
      backgroundColor: '#ffb3af'
    },
    rowIrr: {
        backgroundColor: '#fdfd96'
      }
  }));

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

function PublisherTable (props) {
    const classes = rowStyle();
    const [group, setGroup] = useState(props.group);
    const [publishers, setPublishers] = useState([]);
    const [pubCard, setPubCard] = useState(null);

    useEffect(() => {
        const getPublishers = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/publisher-list/${group}`, config);
                const payload = res.data;
            
                const publisher_set = payload.map(d => ({
                    "id": d.id,
                    "name" : d.name,
                    "email" : d.email,
                    "contact" : d.contact,
                    "birthday" : d.birthday,
                    "irregular": d.irregular,
                    "inactive": d.inactive,
                    "baptismalDate" : d.baptismal_date
                }));

                setPublishers(publishers => (publisher_set));
    
            } catch(err) {
                console.log(err);
            }
        }

        getPublishers();

    }, [group]);

    const onPubChange = name => {
        setPubCard(name);
    }

    const onGroupChange = async (e) => {
        setGroup(e.target.value);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/publisher-list/${e.target.value}`, config);
            const payload = res.data;
        
            const publisher_set = payload.map(d => ({
                "id": d.id,
                "name" : d.name,
                "email" : d.email,
                "contact" : d.contact,
                "birthday" : d.birthday,
                "irregular": d.irregular,
                "inactive": d.inactive,
                "baptismalDate" : d.baptismal_date
            }));

            setPublishers(publishers => (publisher_set));

        } catch(err) {
            console.log(err);
        }
    }

    return (
    <Container component="main" maxWidth="md">
        <Grid container justify="center" alignItems="center" spacing={5}>
           <Grid item xs={12} md={12} >
                <Typography component="h1" align="center" variant="h5">Group Information</Typography>
           </Grid>
           <Grid item xs={7} md={7}>
                <TextField
                    fullWidth
                    variant="outlined"
                    error={false}
                    //helperText="Invalid"
                    label="Group Number"
                    name='group'
                    value={ group }
                    onChange={e => onGroupChange(e)}
                    margin="normal"
                    select
                    >
                    {service_group.map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Publisher</TableCell>
                            <TableCell align="right">Contact Number</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Birthdate</TableCell>
                            <TableCell align="right">Baptismal Date</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {publishers.map((row) => (row.inactive ? (
                                <TableRow key={row.id} >
                                    <TableCell component="th" scope="row" className={classes.row}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.contact}</TableCell>
                                    <TableCell align="right">{row.email}</TableCell>
                                    <TableCell align="right">{row.birthday}</TableCell>
                                    <TableCell align="right">{row.baptismalDate}</TableCell>
                                    <TableCell align="right"><IconButton onClick={e => onPubChange(row.name)}><EditIcon /></IconButton></TableCell>
                                </TableRow>
                            ) : (row.irregular ? (
                                <TableRow key={row.id} >
                                    <TableCell component="th" scope="row" className={classes.rowIrr}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.contact}</TableCell>
                                    <TableCell align="right">{row.email}</TableCell>
                                    <TableCell align="right">{row.birthday}</TableCell>
                                    <TableCell align="right">{row.baptismalDate}</TableCell>
                                    <TableCell align="right"><IconButton onClick={e => onPubChange(row.name)}><EditIcon /></IconButton></TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" >
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.contact}</TableCell>
                                    <TableCell align="right">{row.email}</TableCell>
                                    <TableCell align="right">{row.birthday}</TableCell>
                                    <TableCell align="right">{row.baptismalDate}</TableCell>
                                    <TableCell align="right"><IconButton onClick={e => onPubChange(row.name)}><EditIcon /></IconButton></TableCell>
                                </TableRow>
                            ))
                            ))}
                            
                        </TableBody>
                    </Table>
                </TableContainer>
                <CheckInactive publisher={group} />
            </Grid>
        </Grid>
        <Element name="pubCard">
            <Grid container component={Paper} justify="center" alignItems="center" spacing={5} elevation={5}>
                <Grid item />
                <Grid item xs={12} md={12} >
                        <Typography component="h1" align="center" variant="h5">Publisher Card</Typography>
                </Grid>
                <Grid item xs={12} md={12} >
                        <PublisherAdmin name={pubCard} superuser={props.superuser}/>
                </Grid>
            </Grid>
        </Element>
        <br/>
        <br/>
        {props.superuser === "true" && (
            <Grid container justify="center" alignItems="center" spacing={5}>
                <Grid item />
                <Grid item xs={12} md={12} >
                        <Typography component="h1" align="center" variant="h5">Auxillary Pioneer Form</Typography>
                </Grid>
                <Grid item xs={12} md={12} >
                    <Element name="pioneer">
                        <AuxillaryPioneer />
                    </Element>
                </Grid>
            </Grid>
         )}
    </Container>
    )
}

export default PublisherTable