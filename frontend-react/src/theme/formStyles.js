import { makeStyles } from '@material-ui/core/styles';

const formStyle = makeStyles((theme) => ({
    h2: {
        fontFamily: "'Noto Sans', sans-serif",
        fontWeight: "bold",
    },
    icon: {
        display: "none",
    },
    textbox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    textbox_sm: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    },
    textarea: {
        width: "48%",
        zIndex: "0"
    },
    textarea_sm: {
        width: "100%",
    },
    paper: {
        display: "flex",
        alignItems: "center",
    },
    container: {
        padding: "10%",
    },
    submit: {
        margin: "20px 0",
    },
    select: {
        width: "100%",
    },
    dialogContent: {
        paddingRight: theme.spacing(5),
        paddingLeft: theme.spacing(5)
    },
    disabledButton: {
        backgroundColor: theme.palette.primary,
      }
}));

export default formStyle;