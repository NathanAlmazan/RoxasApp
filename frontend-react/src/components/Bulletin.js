import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';
//components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//style
import homeStyle from '../theme/homeStyle';
import ResponsiveDialog from './ImageDialog';

function Bulletin() {
    const classes = homeStyle();
    const [posts, setPosts] = useState([]);
    const [dialogue, setDialogue] = useState(false);
    const [image, setImage] = useState('');
    const admin = window.sessionStorage.getItem('is_staff');

    const posts_refresh = async () => {
      const config = {
          headers: {
              'Content-Type': 'application/json', 
              'Authorization': `JWT ${localStorage.getItem('access')}`,
              'Accept': 'application/json'
          }
      };
      try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/bulletin/post`, config);
          const data = res.data
  
          const options = data.map(d => ({
              "key": d.id,
              "date" : d.meeting_date,
              "title" : d.uploaded_for,
              "image": d.image
          }))
  
          setPosts(options);
  
      } catch(err) {
          console.log(err);
      }
      
    }

    
    useEffect(() => {
        const get_posts = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            };
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/bulletin/post`, config);
                const data = res.data
        
                const options = data.map(d => ({
                    "key": d.id,
                    "date" : d.meeting_date,
                    "title" : d.uploaded_for,
                    "image": d.image
                }))
        
                setPosts(post => (options));
        
            } catch(err) {
                console.log(err);
            }
            
        }

        get_posts();

    }, [])

    const view_post = (url) => {
      setDialogue(true);
      setImage(url);
    }

    const handleDownload = (url, filename) => {
        axios
          .get(url, {
            responseType: "blob"
          })
          .then((res) => {
            fileDownload(res.data, filename);
          });
      };

    const meeting_date = (date) => {
        var post_date = new Date(date);
        var string_date = post_date.toDateString();
        return string_date;
    }

    const handleDelete = async (key) => {
      const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
        };
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/bulletin/delete/${key}`, config);
            posts_refresh();

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Typography component="h1" variant="h5" className={classes.h2}>
          Bulletin Board
        </Typography>
        <br/>
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item key={post.key} xs={12} sm={6} md={12} lg={4}>
              <Card className={classes.card}>
                <CardHeader
                  titleTypographyProps={{variant: "h6"}}
                  subheaderTypographyProps={{variant: "subtitle2"}}
                  title={post.title}
                  subheader={meeting_date(post.date)}
                />
                <CardMedia
                  className={classes.cardMedia}
                  image={post.image}
                  title="Image title"
                />
                <CardActions>
                  <Button size="small" color="primary" onClick={e => view_post(post.image)}>
                    View
                  </Button>
                  <Button size="small" color="primary" onClick={e => handleDownload(post.image, `${post.date}.jpg`)}>
                    Download
                  </Button>
                  {admin === "true" && (
                    <Button size="small" color="primary" onClick={e => handleDelete(post.key)}>
                     Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <ResponsiveDialog open={dialogue} setOpen={(dialogue) => setDialogue(dialogue)} url={image}/>
      </Container>
    )
}

export default Bulletin

    
