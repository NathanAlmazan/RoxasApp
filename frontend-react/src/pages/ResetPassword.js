import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { reset_password } from '../actions/auth';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function ResetPassword({ reset_password }) {
    const classes = useStyles();
    const [requestSent, setRequestSent] = useState(false);
    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const { email } = formData;

    const onTextChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json', 
            }
          };
          
          try {
            const res =  await axios.get(`${process.env.REACT_APP_API_URL}/accounts/account-search/${email}`, config);
            const data = res.data;

            if (data.detail === 'account exist') {
                reset_password(email);
                setRequestSent(true);
            } else {
                setError(true);
            }
          } catch(err) {
            setError(true);
          } 
        
    };

    if (requestSent) {
        return <Redirect to='/signin' />
    }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Reset Password
            </Typography>
            <form className={classes.form} onSubmit={e => onSubmit(e)} noValidate>
            <TextField
                variant="outlined"
                required
                fullWidth
                error={error}
                helperText={error && "sorry, no account registered to this email"}
                label="Email"
                name='email'
                value={ email }
                onChange={e => onTextChange(e)}
                margin="normal"
                type="email"
                InputProps={{ endAdornment: <InputAdornment position="start">
                    <AccountCircle />
                </InputAdornment>}}/>
            
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Reset Password
            </Button>
            </form>
        </div>
        </Container>
    );
}

export default connect(null, { reset_password })(ResetPassword)
