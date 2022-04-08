import React, { useState } from "react";
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
import Tab01Start from "./Tab01Start";
import Tab02Download from "./Tab02Download";
import Tab03FillData from "./Tab03FillData";
import Tab04Upload from "./Tab04Upload";
import Tab05Check from "./Tab05Check";
import Tab06Validation from "./Tab06Validation";
import Tab07Finished from "./Tab07Finished";

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
  value: PropTypes.any.isRequired
};

const a11yProps = (index) => {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`
  };
}

// const LinkTab = (props) => {
//   return (
//     <Tab
//       component="a"
//       onClick={(event) => {
//         event.preventDefault();
//       }}
//       {...props}
//     />
//   );
// };

// const AntTab = withStyles((theme) => ({
//   root: {
//     opacity: 0.3  ,
//     textTransform: 'none',
//     minWidth: 72,
//     fontWeight: theme.typography.fontWeightRegular,
//     marginRight: theme.spacing(4),
//     fontFamily: [
//       '-apple-system',
//       'BlinkMacSystemFont',
//       '"Segoe UI"',
//       'Roboto',
//       '"Helvetica Neue"',
//       'Arial',
//       'sans-serif',
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(','),
//     '&:hover': {
//       color: '#40a9ff',
//       opacity: 1,
//     },
//     '&$selected': {
//       color: '#1890ff',
//       fontWeight: theme.typography.fontWeightMedium,
//     },
//     '&:focus': {
//       color: '#40a9ff',
//     },
//   },
//   selected: {},
// }))((props) => <Tab {...props} />);

const StyledTab = withStyles((theme) => ({
  root: {
    opacity: 0.8, //0.8,
    //textTransform: 'none',
    //color: '#444',
    //fontWeight: theme.typography.fontWeightRegular,
    //fontSize: theme.typography.pxToRem(15),
    //marginRight: theme.spacing(1),
    // '&:focus': {
    //   opacity: 1,
    // },
    // backgroundColor: "blue",
    // 
    // "&$selected": {
    //   color: "red",
    // }
  },
}))((props) => {
  return (
    <Tab {...props} />
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    //width: "100%",
    //backgroundColor: theme.palette.background.paper,
  },
  // tabs: {
  //   "& .MuiTabs-indicator": {
  //     //display: "none",
  //     backgroundColor: "orange",
  //   }
  // }
}));

const TabsPanel = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  //const { status, setStatus } = useContext(StatusContext);
  const [tabId, setTabId] = useState(0);

  function handleChangeTab(event, id) {
    setTabId(id); // comment to disable the possibility to change tab by clicking on app bar titles
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
          id = tabId + 1;
          break;
        case "prev":
          id = tabId - 1;
          break;
        default:
          console.error(`Unforeseen where specification in goto: ${where}`);
          return;
      }
    }
    setTabId(id);
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0} style={{/*backgroundColor: "transparent",*/ top: 50}}>
        {/* <Tabs
          value={tabId}
          onChange={handleChangeTab}
          indicatorColor="primary"
          // textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
          className={classes.tabs}
        > */}
        <Paper elevation={0} square>
          <Tabs
            value={tabId}
            //indicatorColor="secondary"
            //textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChangeTab}
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

      <TabPanel value={tabId} index={0}>
        <Tab01Start active={tabId === 0} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={tabId} index={1}>
        <Tab02Download active={tabId === 1} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={tabId} index={2}>
        <Tab03FillData active={tabId === 2} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={tabId} index={3}>
        <Tab04Upload active={tabId === 3} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={tabId} index={4}>
        <Tab05Check active={tabId === 4} _value={tabId} _index={4} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={tabId} index={5}>
        <Tab06Validation active={tabId === 5} value={tabId} index={5} goto={(where) => goto(where)} />
      </TabPanel>
      <TabPanel value={tabId} index={6}>
        <Tab07Finished active={tabId === 6} value={tabId} index={6} goto={(where) => goto(where)} />
      </TabPanel>
    </div>
  );
}

export { TabsPanel };