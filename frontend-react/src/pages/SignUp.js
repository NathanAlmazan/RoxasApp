import React, { useState  }from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { signup } from '../actions/auth';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import AsyncSelect from 'react-select/async';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
//icons
import EmailIcon from '@material-ui/icons/Email';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';


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
    select: {
        width: "100%",
    },
    textbox: {
        zIndex: 0,
    }
  }));

const search_elder = async (inputValue) => {
    const config = {
        headers: {
            'Content-Type': 'application/json', 
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/publishers/elder-search/${inputValue}`, config);
        const data = res.data

        const options = data.map(d => ({
            "value": d.id,
            "label": d.name,
            "group": d.group,
            "email": d.email, 
            "contact": d.contact
        }))

        return options;

    } catch(err) {
        console.log(err);
    } 
}


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

function SignUp({ isAuthenticated, signup, errorMess }) {
    const classes = useStyles();
    const signupError = Boolean( errorMess === "Request failed with status code 400");
    const [elderSelect, setElderSelect] = useState(null);
    const [userError, setUserError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [minPass, setMinPass] = useState(false);
    const [signedUp, setSignedUp] = useState(false);
    const [errorPass, setErrorPass] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [signupForm, setForm] = useState({
        id: '',
        username: '',
        email: '',
        contact: '',
        group: 1,
        password: '',
        re_password: ''
    });
    const { username, email, contact, group, password, re_password } = signupForm;

    const check_username = async (user_value) => {
        const config = {
            headers: {
                'Content-Type': 'application/json', 
            }
          };
          const body = JSON.stringify({ user_value })
          try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/account-search/${user_value}`, body, config);
            const data = res.data;

            if (data.detail === 'account exist') {
                setUserError(true);
            } else {
                setUserError(false);
            }
          } catch(err) {
            setUserError(false);
          } 
    }

    const check_email = async (user_email) => {
        const config = {
            headers: {
                'Content-Type': 'application/json', 
            }
          };
          
          try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/account-search/${user_email}`, config);
            const data = res.data;

            if (data.detail === 'account exist') {
                setEmailError(true);
            } else {
                setEmailError(false);
            }
          } catch(err) {
            setEmailError(false);
          } 
    }

    const handleSelect = e => {
        setForm({ ...signupForm, username: e.label, group: e.group, contact: e.contact, email: e.email, id: e.value });
        check_username(e.label);
        setElderSelect(e);
    }

    const onEmailChange = e => {
        setForm({ ...signupForm, email: e.target.value });
        check_email(e.target.value);
    }

    const onTextChange = e => {
        setForm({ ...signupForm, [e.target.name]: e.target.value });
        setMinPass(false);
    }

    const handleClickShowPassword = e => {
        setShowPass(!showPass);
    }

    const onSubmit = e => {
        e.preventDefault();
        if (password.length < 8) {
            setMinPass(true);
        }
        else if (password === re_password) {
            setErrorPass(false);
            signup(username, email, contact, group, password, re_password);
            setSignedUp(true);
        } else {
            setErrorPass(true);
        }
    }

    if (signedUp) {
        return <Redirect to='/signin' />
    }

    if (isAuthenticated) {
        return <Redirect to='/home' />
    }

    return (
        <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {signupError && (
            <Typography variant="caption" color="error">
                Sorry, recent signup failed because email and password are too identical. Please try again.
            </Typography>
        )}
        <br/>
        <form className={classes.form} onSubmit={e => onSubmit(e)} noValidate>
            <Typography component="h6" variant="h6">
                Search Your Name
            </Typography>
            <AsyncSelect className={classes.select}
                value={elderSelect} 
                cacheOptions 
                defaultOptions 
                loadOptions={search_elder} 
                onChange={e => handleSelect(e)} />

            <TextField
                variant="outlined"
                required
                error={userError}
                helperText={userError && `There is an account already registered to ${username}`}
                className={classes.textbox}
                fullWidth
                label="Username"
                name='username'
                value={ username }
                disabled={true}
                margin="normal"
                type="text"
                InputProps={{ endAdornment: <InputAdornment position="start">
                    <AccountCircle />
                </InputAdornment>}}/>

            <TextField
                variant="outlined"
                required
                error={emailError}
                helperText={emailError && `There is an account already registered to ${email}`}
                fullWidth
                className={classes.textbox}
                label="Email"
                name='email'
                value={ email }
                onChange={e => onEmailChange(e)}
                margin="normal"
                type="email"
                InputProps={{ endAdornment: <InputAdornment position="start">
                    <EmailIcon />
                </InputAdornment>}}/>


            <TextField
                variant="outlined"
                required
                fullWidth
                className={classes.textbox}
                label="Contact Number"
                name='contact'
                value={ contact }
                onChange={e => onTextChange(e)}
                margin="normal"
                type="text"
                inputProps={{maxLength: 12}}
                InputProps={{ endAdornment: <InputAdornment position="start">
                    <ContactPhoneIcon />
                </InputAdornment>}}/>

            <TextField
                required
                fullWidth
                className={classes.textbox}
                variant="outlined"
                label="Group Number"
                name='group'
                value={ group }
                onChange={e => onTextChange(e)}
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

            <TextField
                variant="outlined"
                required
                error={errorPass || minPass}
                helperText={errorPass ? 'sorry, password not match' : (minPass && 'password should have more than 8 characters')}
                fullWidth
                label="Password"
                name='password'
                value={ password }
                onChange={e => onTextChange(e)}
                margin="normal"
                type={showPass ? "text" : "password"}
                InputProps={{ endAdornment:  <InputAdornment position="end">
                <IconButton
                    onClick={e => handleClickShowPassword(e)}
                >
                    {showPass ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                </InputAdornment>}}/>

            <TextField
                variant="outlined"
                required
                error={errorPass || minPass}
                helperText={errorPass ? 'sorry, password not match' : (minPass && 'password should have more than 8 characters')}
                fullWidth
                label="Confirm Password"
                name='re_password'
                value={ re_password }
                onChange={e => onTextChange(e)}
                margin="normal"
                type={showPass ? "text" : "password"}
                InputProps={{ endAdornment:  <InputAdornment position="end">
                <IconButton
                    onClick={e => handleClickShowPassword(e)}
                >
                    {showPass ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                </InputAdornment>}}/>
            <br/>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Sign Up
            </Button>
            <Grid container>
                <Grid item xs>
                <Link href="/signin" variant="body2">
                   Already have an account?
                </Link>
                </Grid>
            </Grid>
        </form>
      </div>
    </Container>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errorMess: state.auth.errorMess
});

export default connect(mapStateToProps, { signup })(SignUp)
