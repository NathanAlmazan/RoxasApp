import React, { lazy,useState } from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Redirect, useHistory } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { logout } from '../actions/auth';
import Hidden from "@material-ui/core/Hidden";
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-scroll';
import MenuIcon from '@material-ui/icons/Menu';
import homeStyle from '../theme/homeStyle';

const PublisherTable = lazy(() => import('./PublisherTable'));

function PublisherPanel({isAuthenticated, logout}) {
    
    const username = window.sessionStorage.getItem('username');
    const elder_group = window.sessionStorage.getItem('group');
    const is_staff = window.sessionStorage.getItem('is_staff');
    const is_superuser = window.sessionStorage.getItem('is_superuser');
    
    const classes = homeStyle();
    const loggedIn = Boolean(localStorage.getItem('access')) && Boolean(localStorage.getItem('refresh'));
    const [openMenu, setOpenMenu] = useState(false);
    const mobile = useMediaQuery('(min-width:900px)')
    let history = useHistory();
  
    const handleMenu = () => {
      setOpenMenu(!openMenu)
    }
  
    const handleAdmin = () => {
      history.push("/dashboard");
    }

    const handleHome = () => {
        history.push("/home");
      }
  
    const handleLogout = () => {
        logout();
    }; 

    if (!isAuthenticated) {
      if (!loggedIn) {
        return <Redirect to='/' />
      }
    }

    if (is_staff !== "true") {
      return <Redirect to='/signin' />
    }
  
    return (
        <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
        <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item xs={10} sm={10} md={8}>
                <Typography variant="h6" color="inherit" align="left" className={classes.h1} noWrap>
                  Welcome {username}
                </Typography>
              </Grid>
              <Grid item>
                <Hidden smDown>
                  <Button color="secondary" onClick={handleHome}>
                    Home
                  </Button>
                </Hidden>
                <Hidden smDown>
                  <Button color="secondary" onClick={handleAdmin}>
                    Reports
                  </Button>
                </Hidden>
                <Hidden smDown>
                  <Button variant="outlined" color="secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </Hidden>
              </Grid>
              <Hidden mdUp>
                <Grid item>
                   <IconButton color="secondary" onClick={handleMenu}>
                     <MenuIcon/>
                   </IconButton>
                </Grid>
              </Hidden>
              <Collapse in={mobile ? false : openMenu} timeout={800}>
                <Grid container direction="column" justify="center" alignItems="center" spacing={2} className={classes.appbarMobile}>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handleHome}>
                        Home
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handleAdmin}>
                        Reports
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary" className={classes.heroButtons}>
                        <Link to="pubCard" spy={true} smooth={true} duration={500}>Publisher Card</Link>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary" className={classes.heroButtons}>
                      <Link to="pioneer" spy={true} smooth={true} duration={500}>Add Auxillary</Link>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handleLogout}>
                        Logout
                    </Button>
                  </Grid>
                </Grid>
              </Collapse>
          </Grid>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Container className={classes.cardGrid} maxWidth="md">
            <PublisherTable group={elder_group} superuser={is_superuser}/>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}/>
    </React.Fragment>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, {logout})(PublisherPanel);