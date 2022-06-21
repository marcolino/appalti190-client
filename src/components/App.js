import React, { useContext } from "react";
import { makeStyles } from "@mui/styles";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import ModalProvider from "mui-modal-provider";
import CssBaseline from "@mui/material/CssBaseline";
import { OnlineStatusProvider, OnlineStatusContext } from "../providers/OnlineStatusProvider";
import Header from "./Header";
import Routes from "./Routes";
import Footer from "./Footer";
import Loader from "./Loader";
import CookieBanner from "./CookieBanner";
import { isAuthLocation } from "../libs/Misc";
import config from "../config";
import theme from "../themes/default"; // here we choose the theme

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ModalProvider>
        <ThemeProvider theme={theme}>
          <OnlineStatusProvider>
            <CssBaseline />
            <BrowserRouter>
              <Loader />
              <Contents />
              <CookieBanner />
              {/* <FloatingActionButton/> */}
            </BrowserRouter>
            {/* <PushNotifications /> */}
          </OnlineStatusProvider>
        </ThemeProvider>
      </ModalProvider>
    </StyledEngineProvider>
  );
}

const useStyles = makeStyles(theme => ({
  contentsContainer: {
    position: "relative",
    minHeight: "100vh",
  },
  contentsWrap: props => ({
    paddingBottom: props.footerHeight,
  }),
  header: {
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
    padding: theme.spacing(2),
  },
  footer: props => ({
    position: "absolute",
    bottom: "0.5rem",
    width: "100%",
    height: props.footerHeight,
  }),
}));

const Contents = () => {
  const location = useLocation();
  const isOnline = useContext(OnlineStatusContext);
	const classes = useStyles({footerHeight: isAuthLocation(location) ? 0 : config.ui.footerHeight }); // hide footer while in auth screens

  return (
    <div className={classes.contentsContainer}>
      <div className={classes.contentsWrap}>
        <div className={classes.header}>
          <Header />
        </div>
        <div className={classes.body}>
          <Routes />
        </div>
      </div>
      <div className={classes.footer}>
        <Footer isOnline={isOnline} />
      </div>
    </div>
  );
}

export default React.memo(App);