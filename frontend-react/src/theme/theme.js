import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1d334d",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#ffffff",
      contrastText: "#1d334d"
    }
  },
  typography: {
    subtitle1: {
      fontWeight: 400,
      fontSize: "1.2rem",
      textTransform: "uppercase"
    }
  }
});

export default theme;
