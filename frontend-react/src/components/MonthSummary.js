import React, { useState, useEffect, lazy, Suspense, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import homeStyle from '../theme/homeStyle';

const Pioneer = lazy(() => import('./Pioneer'));


function MonthSummary(props, ref) {
  const classes = homeStyle();
  const initial_year = props.CurrYear;
  const initial_month = props.CurrMonth;
  const [openDialog, setOpenDialog] = useState(false);
  const [pr_status, setPrStatus] = useState(false);
  const [summary, setSummary] = useState({
    publishers: null,
    auxi_pr: null,
    reg_pr: null,
  });
  const { publishers, auxi_pr, reg_pr } = summary;

  useImperativeHandle(ref, () => ({
    async getSummary() {
      const config = {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${localStorage.getItem('access')}`,
              'Accept': 'application/json'
          }
      };
      try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/month-sum/${initial_month}/${initial_year}`, config);
          const payload = res.data;
      
          setSummary(summary => ({ ...summary, publishers: payload.publishers, 
                                              auxi_pr: payload.auxi, 
                                              reg_pr: payload.regPr,
                                              }));

      } catch(err) {
          console.log(err);
      }
    }
  }), [initial_month, initial_year])

  const handlePioneer = () => {
    setOpenDialog(true);
    setPrStatus(false);
  }

  const handleRegPioneer = () => {
    setOpenDialog(true);
    setPrStatus(true);
  }

  useEffect(() => {
    
    const get_summary = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/month-sum/${initial_month}/${initial_year}`, config);
            const payload = res.data;
        
            setSummary(summary => ({ ...summary, publishers: payload.publishers, 
                                                auxi_pr: payload.auxi, 
                                                reg_pr: payload.regPr,
                                                 }));

        } catch(err) {
            console.log(err);
        }
    };

    get_summary();

  }, [initial_month, initial_year]);

  return (
      <div>
        <br />
         <Typography component="h1" align="center" variant="h5" className={classes.h2}>Publisher Report Summary</Typography>
         <br />
        {!publishers ? (<div>Loading...</div>) : (
             <Grid container spacing={4}>
             <Grid item xs={12} sm={6} md={4}>
               <Card className={classes.card}>
                 <CardContent className={classes.cardContent}>
                    <Typography align="center" component="p" variant="h4">
                       {publishers.total_hours}
                   </Typography>
                   <Typography  align="center" color="textSecondary" >
                        Total Hours
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <Card className={classes.card}>
                 <CardContent className={classes.cardContent}>
                    <Typography align="center" component="p" variant="h4">
                      {publishers.total_placements}
                   </Typography>
                   <Typography align="center" color="textSecondary" >
                       Total Placements
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <Card className={classes.card}>
                 <CardContent className={classes.cardContent}>
                    <Typography align="center" component="p" variant="h4">
                      {publishers.total_videos}
                   </Typography>
                   <Typography align="center" color="textSecondary" >
                       Total Videos
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <Card className={classes.card}>
                 <CardContent className={classes.cardContent}>
                    <Typography align="center" component="p" variant="h4">
                       {publishers.total_rv}
                   </Typography>
                   <Typography align="center" color="textSecondary" >
                       Total Return Visits
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <Card className={classes.card}>
                 <CardContent className={classes.cardContent}>
                    <Typography align="center" component="p" variant="h4">
                       {publishers.total_bs}
                   </Typography>
                   <Typography align="center" color="textSecondary" >
                       Total Bible Study
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <Card className={classes.card}>
                 <CardContent className={classes.cardContent}>
                    <Typography align="center" component="p" variant="h4">
                       {publishers.total_pub}
                   </Typography>
                   <Typography align="center" color="textSecondary" >
                       Total Publishers
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
         </Grid>
        )}

        <br />
         <Typography component="h1" align="center" variant="h5" className={classes.h2}>Auxillary Pioneer Report Summary</Typography>
        <br />
        {!auxi_pr ? (<div>Loading...</div>) : (
          <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                 <Typography align="center" component="p" variant="h4">
                    {auxi_pr.total_hours}
                </Typography>
                <Typography align="center" color="textSecondary" >
                    Total Hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                 <Typography align="center" component="p" variant="h4">
                  {auxi_pr.total_placements}
                </Typography>
                <Typography align="center" color="textSecondary" >
                   Total Placements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                 <Typography  align="center" component="p" variant="h4">
                   {auxi_pr.total_videos}
                </Typography>
                <Typography align="center" color="textSecondary" >
                   Total Videos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                 <Typography align="center" component="p" variant="h4">
                    {auxi_pr.total_rv}
                </Typography>
                <Typography align="center" color="textSecondary" >
                   Total Return Visits
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                 <Typography align="center" component="p" variant="h4">
                    {auxi_pr.total_bs}
                </Typography>
                <Typography align="center" color="textSecondary" >
                   Total Bible Study
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card} onClick={handlePioneer}>
              <CardContent className={classes.cardContent}>
                 <Typography align="center" component="p" variant="h4">
                    {auxi_pr.total_pub}
                </Typography>
                <Typography align="center" color="textSecondary" >
                    Total Auxillary Pioneers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        )}

        <br />
         <Typography component="h1" align="center" variant="h5" className={classes.h2}>Regular Pioneer Report Summary</Typography>
         <br />
        {!reg_pr ? (<div>Loading...</div>) : (
           <Grid container spacing={4}>
           <Grid item xs={12} sm={6} md={4}>
             <Card className={classes.card}>
               <CardContent className={classes.cardContent}>
                  <Typography align="center" component="p" variant="h4">
                     {reg_pr.total_hours}
                 </Typography>
                 <Typography align="center" color="textSecondary" >
                     Total Hours
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4}>
             <Card className={classes.card}>
               <CardContent className={classes.cardContent}>
                  <Typography align="center" component="p" variant="h4">
                    {reg_pr.total_placements}
                 </Typography>
                 <Typography align="center" color="textSecondary" >
                    Total Placements
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4}>
             <Card className={classes.card}>
               <CardContent className={classes.cardContent}>
                  <Typography align="center" component="p" variant="h4">
                    {reg_pr.total_videos}
                 </Typography>
                 <Typography align="center" color="textSecondary" >
                     Total Videos
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4}>
             <Card className={classes.card}>
               <CardContent className={classes.cardContent}>
                  <Typography align="center" component="p" variant="h4">
                     {reg_pr.total_rv}
                 </Typography>
                 <Typography align="center" color="textSecondary" >
                     Total Return Visits
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4}>
             <Card className={classes.card}>
               <CardContent className={classes.cardContent}>
                  <Typography align="center" component="p" variant="h4">
                     {reg_pr.total_bs}
                 </Typography>
                 <Typography align="center" color="textSecondary" >
                     Total Bible Study
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4}>
             <Card className={classes.card} onClick={handleRegPioneer}>
               <CardContent className={classes.cardContent}>
                  <Typography align="center" component="p" variant="h4">
                     {reg_pr.total_pub}
                 </Typography>
                 <Typography align="center" color="textSecondary" >
                    Total Regular Pioneers
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
        </Grid>
        )}
        {openDialog && (
          <Suspense fallback={<div>Loading, Please wait...</div>}>
             <Pioneer open={openDialog} handleClose={openDialog => setOpenDialog(openDialog)} pioneer={pr_status} curr_month={props.CurrMonth} curr_year={props.CurrYear} />
          </Suspense>
        )}
        
        </div>
  );
}

export default forwardRef(MonthSummary)