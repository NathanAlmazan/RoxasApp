import React, {useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
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

function SignIn({ login, isAuthenticated, errorMess }) {
    const classes = useStyles();
    const error = Boolean(errorMess === "Request failed with status code 401");
    const signupError = Boolean( errorMess === "Request failed with status code 400");
    const [emailError, setEmailError] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData

    const onTextChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
   
    const handleClickShowPassword = e => {
        setShowPass(!showPass);
    }

    const onSubmit = async (e) => {
      e.preventDefault();
      const config = {
          headers: {
              'Content-Type': 'application/json', 
          }
        };
        
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/account-search/${email}`, config);
          const data = res.data;

          if (data.detail === 'account exist') {
              login(email, password);
              setEmailError(false);
          } else {
              setEmailError(true);
          }
        } catch(err) {
          setEmailError(true);
        } 
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
        {signupError && (
          <Redirect to='/signup' />
        )}
        <form className={classes.form} onSubmit={e => onSubmit(e)} noValidate>
        <TextField
            variant="outlined"
            required
            error={emailError}
            helperText={emailError && "No Account Registered to this Email"}
            fullWidth
            label="Email"
            name='email'
            value={ email }
            onChange={e => onTextChange(e)}
            margin="normal"
            type="email"
            InputProps={{ endAdornment: <InputAdornment position="start">
                <AccountCircle />
            </InputAdornment>}}/>
        <TextField
            variant="outlined"
            required
            error={error}
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
              <Link href="/reset-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
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

export default connect(mapStateToProps, { login })(SignIn);