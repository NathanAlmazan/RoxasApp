import React, { lazy, Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Redirect, useHistory } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
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
import MenuIcon from '@material-ui/icons/Menu';
import homeStyle from '../theme/homeStyle';
import Admin from '../components/Admin';
import Post from '../components/Post';
import { Link, Element } from 'react-scroll';

const ReportTable = lazy(() => import('../components/ReportTable'));

function Dashboard({isAuthenticated, logout}) {
    
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
      history.push("/home");
    }

    const handlePublishers = () => {
      history.push("/publishers");
    }
  
    const handleLogout = () => {
        logout();
    }; 

    const [pendingRep, setPendingRep] = useState([])

    const refresh_pending = async () => {
      const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
        };

        const body = JSON.stringify({ username })
        if (is_superuser === "true") {
          try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/report/no-report/pk/mt/yr`, body, config);
            const payload = res.data
            
            const reports = payload.map(d => ({
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
              "pending": d.pending
          }))

            setPendingRep(reports);
          } catch (err) {
            console.log(err.data);
          }
        }
    }

    useEffect(() => {
      const get_pending = async () => {
        const config = {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${localStorage.getItem('access')}`,
              'Accept': 'application/json'
          }
          };

          const body = JSON.stringify({ username })
  
          try {
              const res = await axios.post(`${process.env.REACT_APP_API_URL}/report/no-report/pk/mt/yr`, body, config);
              const payload = res.data
              
              const reports = payload.map(d => ({
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
                "pending": d.pending
            }))
  
              setPendingRep(pendingRep => (reports));
          } catch (err) {
              console.log(err.data);
          }
      }

      if (is_superuser === "true") {
        get_pending();
      }
    }, [is_superuser, username]);

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
                  <Button color="secondary" onClick={handleAdmin}>
                    Home
                  </Button>
                </Hidden>
                <Hidden smDown>
                  <Button color="secondary" onClick={handlePublishers}>
                    Publishers
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
                    <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handleAdmin}>
                      Home
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary" className={classes.heroButtons} onClick={handlePublishers}>
                      Publishers
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" className={classes.heroButtons} color="secondary" >
                      <Link to="post" spy={true} smooth={true} duration={500}>Post to Bulletin</Link>
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
        <Typography component="h1" align="center" variant="h5" className={classes.h2}>Report Dashboard</Typography>
        <br/>
          <Admin group={elder_group} superuser={is_superuser} />
        </Container>
        {is_superuser === "true" && (
          <Container className={classes.cardGrid} maxWidth="md">
            <Typography component="h1" align="center" variant="h5" className={classes.h2}>Pending Reports</Typography>
            <br/>
            <Suspense fallback={<div>Loading, Please wait...</div>}>
              <ReportTable data={pendingRep} no_data={[]} superuser={true} refresh_comp={refresh_pending}/>
            </Suspense>
          </Container>
        )}
        <Container className={classes.cardGrid} component={Paper} elevation={5} maxWidth="md">
          <Grid container justify="center" alignItems="center" spacing={5}>
           
              <Grid item xs={12} sm={12} md={8}>
                <Element name="post">
                  <Typography component="h1" align="center" variant="h5" className={classes.h2}>Bulletin Post</Typography>
                  <br />
                  <Post />
                </Element>
              </Grid>
            
          </Grid>
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

export default connect(mapStateToProps, {logout})(Dashboard);