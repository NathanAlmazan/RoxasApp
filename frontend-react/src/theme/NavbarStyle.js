import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = "100%";

const NavbarStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100vw"
  },
  appBar: {
    zIndex: 5, 
    opacity: 0.7
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#d3e0e5",
    zIndex: 0
  },
  drawerContainer: {
    overflow: "auto"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default NavbarStyles;
