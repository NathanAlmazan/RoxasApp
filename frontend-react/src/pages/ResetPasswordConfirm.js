import React, { useState } from 'react';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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

function ResetPasswordConfirm({ match, reset_password_confirm }) {
    const classes = useStyles();
    const [error, setError] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    const onTextChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleClickShowPassword = e => {
        setShowPass(!showPass);
    }

    const onSubmit = e => {
        e.preventDefault();

        const uid = match.params.uid;
        const token = match.params.token;

        if (new_password === re_new_password) {
            reset_password_confirm(uid, token, new_password, re_new_password);
            setRequestSent(true);
        } else {
            setError(true);
        }

       
    };

    if (requestSent) {
        return <Redirect to='/' />
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
                variant="outlined"
                required
                error={error}
                helperText={error ? 'sorry, passwordnot match' : null}
                fullWidth
                label="Password"
                name='new_password'
                value={ new_password }
                onChange={e => onTextChange(e)}
                margin="normal"
                type={showPass ? "text" : "password"}
                inputProps={{ minLength: 8 }}
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
                error={error}
                helperText={error ? 'sorry, passwordnot match' : null}
                fullWidth
                label="Re-type Password"
                name='re_new_password'
                value={ re_new_password }
                onChange={e => onTextChange(e)}
                margin="normal"
                type={showPass ? "text" : "password"}
                inputProps={{ minLength: 8 }}
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
                Reset Password
            </Button>
            </form>
        </div>
        </Container>
    )
}

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm)
