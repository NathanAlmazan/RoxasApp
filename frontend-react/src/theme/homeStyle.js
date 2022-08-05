import { makeStyles } from '@material-ui/core/styles';

const homeStyle = makeStyles((theme) => ({
    appbar: {
      background: "none"
    },
    footer: {
      height: "100px"
    },
    heroButtons: {
      width: "230px"
    },
    cardGrid: {
      padding: theme.spacing(8, 2, 5, 2)
    },
    card: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    cardMedia: {
      paddingTop: "50%" // 16:9
    },
    cardContent: {
      flexGrow: 1
    },
    appbarMobile: {
      width: "95vw",
      margin: "20px 0px",
    },
    icon: {
      marginRight: theme.spacing(2),
    },
    image: {
      objectFit: "cover",
      flexShrink: 0,
    },
    h1: {
      fontFamily: "'Archivo Black', sans-serif",
    },
    h2: {
      fontFamily: "'Noto Sans', sans-serif",
      fontWeight: "bold",
    },
    imageContainer: {
      height: "80vh",
      width: "70vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
    },
    form: {
      margin: theme.spacing(8, 2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    bulletin: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    },
    avatar: {
      backgroundColor: "#dae5f1",
      color: "#1d334d"
    }
  }));

export default homeStyle;