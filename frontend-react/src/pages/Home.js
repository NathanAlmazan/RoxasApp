import React, {useState} from "react";
import Box from "@material-ui/core/Box";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
//style
import homeStyle from '../theme/homeStyle';
//components
import Report from '../components/Report';
import Bulletin from '../components/Bulletin';
import { Link, Element } from 'react-scroll';


function Home({isAuthenticated, user, logout}) {
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

  const handlePub = () => {
    history.push("/publishers");
}

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  
  if (!isAuthenticated) {
    if (!loggedIn) {
      return <Redirect to='/' />
    }   
  }

  return (
    <Box sx={{height: "100vh"}}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item md={9} lg={9}>
                <Typography variant="h6" color="inherit" align="left" className={classes.h1} noWrap>
                  Roxas Congregation
                </Typography>
              </Grid>
                {!user ? (<span>Loading...</span>) : (
                  user.is_staff && (
                    <Grid item>
                      <Hidden smDown>
                        <Button color="secondary" onClick={handleAdmin}>
                          Reports
                        </Button>
                      </Hidden>
                  </Grid>
                  )
                )}
                {!user ? (<span>Loading...</span>) : (
                  user.is_staff && (
                    <Grid item>
                      <Hidden smDown>
                        <Button color="secondary" onClick={handlePub}>
                          Publishers
                        </Button>
                    </Hidden>
                  </Grid>
                  )
                )}
               <Grid item>
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
                    <Button variant="outlined" className={classes.heroButtons} color="secondary" >
                      <Link to="report" spy={true} smooth={true} duration={500}>Report</Link>
                    </Button>
                  </Grid>
                  
                  {!user ? (<span>Loading...</span>) : (
                  user.is_staff && (
                      <Grid item xs={12} sm={12}>
                        <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handleAdmin}>
                          Reports
                        </Button>
                      </Grid>
                  )
                )}

                {!user ? (<span>Loading...</span>) : (
                  user.is_staff && (
                      <Grid item xs={12} sm={12}>
                        <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handlePub}>
                          Publishers
                        </Button>
                      </Grid>
                  )
                )}
                 
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
      <Grid container component="main" direction="row" justify="space-evenly">
      <Grid item xs={12} md={6} lg={7} className={classes.bulletin}>
            <Bulletin />
        </Grid>
        <Grid item xs={12} md={5} lg={4} className={classes.form}>
          <Element name="report">
            <Report />
          </Element>
        </Grid>
      </Grid>
      <footer className={classes.footer} />
    </Box>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, { logout })(Home);
