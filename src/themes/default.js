import { createTheme, adaptV4Theme } from "@mui/material/styles";
import { lightGreen, lightBlue, grey, amber } from '@mui/material/colors';
//import { red } from "@mui/material/colors";

export default createTheme(adaptV4Theme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Open Sans', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
  overrides: {
    MuiTabs: {
      root: {
        color: lightGreen[700],
        backgroundColor: lightGreen[50],
      },
      indicator: {
        backgroundColor: lightGreen[600],
      }
    },
    MuiTab: {
      "root": {
        "color": "black",
        "&$selected": {
          "color": "white",
          "backgroundColor": lightGreen[400],
        },
      },
      // color: "yellow",
      // backgroundColor: "red",
      // selected: {
      //   backgroundColor: "red", //lightGreen[900],
      //   _color: "red",
      //   "_&:hover": {
      //     backgroundColor: lightGreen[600],
      //     color: "red",
      //   },
      // },
      // root: {
      //   _backgroundColor: amber[900],
      //   _color: "red",
      //   "_&:hover": {
      //     backgroundColor: lightBlue[300],
      //     color: "red",
      //   },
      // },
    },
    OLDMuiTab: {
      // general overrides for your material tab component here
      root: {
        backgroundColor: lightBlue[200],
        color: lightGreen[400],
        "&$selected": {
          backgroundColor: lightGreen[400],
          color: "red",
        },
      },
    },
    MuiInputBase: {
      input: {
        "&:-webkit-autofill": {
          transitionDelay: "9999s",
          transitionProperty: "background-color, color",
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#c2d4fb",
      main: "rgba(0,0,0,0.5)",
      dark: "#778899",
      //contrastText: "red", //"#fff"
      // light: blueGrey[100],
      // main: blueGrey[200],
      // dark: blueGrey[300],
      contrastText: "white",
    },
    secondary: {
      light: lightGreen[100],
      main: lightGreen[300],
      dark: lightGreen[500],
    },
    tertiary: {
      light: amber[50],
      main: amber[100],
      dark: amber[200],
    },
    title: {
      color: grey[600],
      backgroundColor: amber[200],
    },
    header: {
      color: grey[900],
      backgroundColor: amber[50],
    },
    socialButtons: {
      facebook: {
        backgroundColor: "#1877f2",
      },
      google: {
        backgroundColor: "#db4437",
      },
    },
  },
}));
