import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TokenService from "../services/TokenService";
import JobService from "../services/JobService";
import Tab01Start from "./Tab01Start";
import Tab02Download from "./Tab02Download";
import Tab03FillData from "./Tab03FillData";
import Tab04Upload from "./Tab04Upload";
import Tab05Check from "./Tab05Check";
import Tab06Validation from "./Tab06Validation";
import Tab07Finished from "./Tab07Finished";
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
  const [ job, setJob ] = useState(() => TokenService.getJob());
  //const { job, setJob } = useContext(JobContext);
  //const [ job, setJob ] = useState(JobService.get());
  //const [ job, setJob ] = useState(TokenService.getJob());
  //const redirect = TokenService.getRedirect();
  //const [ tabId, setTabId ] = useState(TokenService.getJob());
  const { t } = useTranslation();

  useEffect(() => {
    const redirect = TokenService.get("redirect");
    if (redirect) {
      setJob({...job, tabId: redirect });
      TokenService.remove("redirect");
    }
  }, [job]);
  
  useEffect(() => { // to serialize job
    TokenService.setJob(job); // serialize locally, on local storage
    JobService.set(job); // serialize remotely, on server db
  }, [job]);

  function changeTab(id) {
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

  if (!job?.tabId) job.tabId = 0;
  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0} style={{/*backgroundColor: "transparent",*/ top: 50}}>
        {/* <Tabs
          value={job.tabId}
          onChange={forceTab}
          indicatorColor="primary"
          // textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
          className={classes.tabs}
        > */}
        <Paper elevation={0} square>
          <Tabs
            value={job?.tabId}
            //indicatorColor="secondary"
            //textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            onChange={forceTab}
            aria-label="current section"
          >
            <StyledTab label={`${t("Start")} 🪄`} {...a11yProps(0)} />
            <StyledTab label={`${t("Download")} ⬇`} {...a11yProps(1)} />
            <StyledTab label={`${t("Fill your data")} 🖋`} {...a11yProps(2)} />
            <StyledTab label={`${t("Upload")} ⬆`} {...a11yProps(3)} />
            <StyledTab label={`${t("Check")} ✔`} {...a11yProps(4)} />
            <StyledTab label={`${t("Wait for validation")} 🎯`} {...a11yProps(5)} />
            <StyledTab label={`${t("Finish!")} 🏁`} {...a11yProps(6)} />
          </Tabs>
        </Paper>
      </AppBar>

      <>
        {(job?.tabId === 0) && (
          <TabPanel index={0} value={job.tabId}>
            <Tab01Start goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
        {(job?.tabId === 1) && (
          <TabPanel index={1} value={job.tabId}>
            <Tab02Download goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
        {(job?.tabId === 2) && (
          <TabPanel index={2} value={job.tabId}>
            <Tab03FillData goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
        {(job?.tabId === 3) && (
          <TabPanel index={3} value={job.tabId}>
            <Tab04Upload goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
        {(job?.tabId === 4) && (
          <TabPanel index={4} value={job.tabId}>
            <Tab05Check goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
        {(job?.tabId === 5) && (
          <TabPanel index={5} value={job.tabId}>
            <Tab06Validation goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
        {(job?.tabId === 6) && (
          <TabPanel index={6} value={job.tabId}>
            <Tab07Finished goto={goto} job={job} setJob={job => setJob(job)} />
          </TabPanel>
        )}
      </>
      {/* <>
        <Tab01Start active={job?.tabId === 0} tabId={job?.tabId} goto={(where) => goto(where)} />
        <Tab02Download active={job?.tabId === 1} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
        <Tab03FillData active={job?.tabId === 2} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
        <Tab04Upload active={job?.tabId === 3} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
        <Tab05Check active={job?.tabId === 4} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
        <Tab06Validation active={job?.tabId === 5} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
        <Tab07Finished active={job?.tabId === 6} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </> */}

      {/* <TabPanel value={job?.tabId || 0} index={0}>
        <Tab01Start active={job?.tabId === 0} tabId={job?.tabId} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={job?.tabId || 0} index={1}>
        <Tab02Download active={job?.tabId === 1} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={job?.tabId || 0} index={2}>
        <Tab03FillData active={job?.tabId === 2} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={job?.tabId || 0} index={3}>
        <Tab04Upload active={job?.tabId === 3} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={job?.tabId || 0} index={4}>
        <Tab05Check active={job?.tabId === 4} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={job?.tabId || 0} index={5}>
        <Tab06Validation active={job?.tabId === 5} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={job?.tabId || 0} index={6}>
        <Tab07Finished active={job?.tabId === 6} tabId={job?.tabId || 0} goto={(where) => goto(where)} />
      </TabPanel> */}
    </div>
  );
}

export { TabsPanel };