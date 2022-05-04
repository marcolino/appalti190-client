import React, { useState, useEffect/*, useContext*/ } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
//import { StatusContext } from "../providers/StatusProvider";
//import { JobContext } from "../providers/JobProvider";
//import JobService from "../services/JobService";
import TokenService from "../services/TokenService";
import Tab04Upload from "./Tab04Upload";
import Tab05Check from "./Tab05Check";
import config from "../config";



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box p={3}>
        {children}
      </Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
// TabPanel.defaultProps = {
//   value: 0, // TODO: ???
// };

const a11yProps = (index) => {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`
  };
}

const StyledTab = withStyles((theme) => ({
  root: {
    opacity: 0.8,
  },
}))(props => {
  return (
    <Tab {...props} />
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    "& .MuiTabs-indicator": {
      //display: "none",
      backgroundColor: "orange",
    }
  }
}));

const TabsPanel = () => {
  const classes = useStyles();
  const [ job, setJob ] = useState({});
  //const { job, setJob } = useContext(JobContext);
  //const [ job, setJob ] = useState(JobService.get());
  //const [ job, setJob ] = useState(TokenService.getJob());
//  const redirect = TokenService.getRedirect();
  //const [ tabId, setTabId ] = useState(TokenService.getJob());
  const { t } = useTranslation();

  function changeTab(id) {
console.log("changeTab ID:", id);
console.log("changeTab JOB BEFORE SETJOB in tabspanel:", job);
    setJob({...job, tabId: id });
  }

  function forceTab(event, id) {
    if (config.ui.userCanForceTabChange) { // user can force tab change by clicking on app bar titles
      changeTab(id);
    }
  }
  
  function goto(where) {
    let id = where;
    if (typeof where === "string") {
      switch (where.toLowerCase()) {
        case "start":
          break;
        case "download":
          break;
        case "fill your data":
          break;
        case "upload":
          break;
        case "check":
          break;
        case "wait for validation":
          break;
        case "finish!":
          break;
        case "next":
          id = job ? job.tabId + 1 : 0;
          break;
        case "prev":
          id = job ? job.tabId - 1 : 0;
          break;
        default:
          console.error(`Unforeseen where specification in goto: ${where}`);
          return;
      }
    }
    changeTab(id);
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0} style={{/*backgroundColor: "transparent",*/ top: 50}}>
        <Paper elevation={0} square>
          <Tabs
            value={job?.tabId || 0}
            variant="scrollable"
            scrollButtons="auto"
            onChange={forceTab}
            aria-label="current section"
          >
            <StyledTab label={`${t("Upload")} ⬆`} {...a11yProps(3)} />
            <StyledTab label={`${t("Check")} ✔`} {...a11yProps(4)} />
          </Tabs>
        </Paper>
      </AppBar>

      <>
        {(job?.tabId === 0) && <Tab04Upload goto={goto} job={job} setJob={job => setJob(job)} />}
        {(job?.tabId === 1) && <Tab05Check goto={goto} job={job} setJob={job => setJob(job)} />}
      </>
    </div>
  );
}

export { TabsPanel };