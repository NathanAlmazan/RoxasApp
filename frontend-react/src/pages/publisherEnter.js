import React, {useState} from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';


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

const service_group = [
    {value: process.env.REACT_APP_BASE_EMAIL1, label: 'Group 1' },
    {value: process.env.REACT_APP_BASE_EMAIL2, label: 'Group 2' },
    {value: process.env.REACT_APP_BASE_EMAIL3, label: 'Group 3' },
    {value: process.env.REACT_APP_BASE_EMAIL4, label: 'Group 4' },
    {value: process.env.REACT_APP_BASE_EMAIL5, label: 'Group 5' },
    {value: process.env.REACT_APP_BASE_EMAIL6, label: 'Group 6' },
    {value: process.env.REACT_APP_BASE_EMAIL7, label: 'Group 7' },
    {value: process.env.REACT_APP_BASE_EMAIL8, label: 'Group 8' },
    {value: process.env.REACT_APP_BASE_EMAIL9, label: 'Group 9' },
    {value: process.env.REACT_APP_BASE_EMAIL10, label: 'Group 10' }
];

function PublisherEnter({ login, isAuthenticated, errorMess }) {
    const classes = useStyles();
    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const error = Boolean(errorMess === "Request failed with status code 401")
    const [showPass, setShowPass] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData

    const onTextChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setPassError(false);
        setEmailError(false);
    };
    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
          setEmailError(true);
        } 
        else if (password === '') {
          setPassError(true);
        } else {
          login(email, password);
        }
    };
    const handleClickShowPassword = e => {
        setShowPass(!showPass);
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
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={e => onSubmit(e)} noValidate>
        <TextField
                required
                fullWidth
                error={emailError}
                helperText={emailError && "Please Select your Group"}
                className={classes.textbox}
                variant="outlined"
                label="Group Number"
                name='email'
                value={ email }
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
            error={error || passError}
            helperText={error && 'Sorry, Wrong Password'}
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
         <br/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/signin" variant="body2">
                Login as Admin?
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

export default connect(mapStateToProps, { login })(PublisherEnter);