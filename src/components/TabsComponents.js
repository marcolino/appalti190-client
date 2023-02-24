import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import useWindowSize from "../hooks/useWindowSize";
import config from "../config";

// const height = window.innerHeight;
// const width = window.innerWidth;
// const heightScrollable = (
//   (height >= width) ?
//     //height - (height *.12) - (height *.12) - (height *.12) // portrait
//     height * .64 // portrait
//   :
//     //height - (height *.16) - (height *.16) - (height*.16) // landscape
//     height * .52 // landscape
//   );

//console.log("height, width, heightScrollable:", height, width, heightScrollable);
const useStyles = makeStyles(theme => ({
	paragraph: {
    fontSize: "1.1em",
	},
	paragraphSmall: {
    fontSize: "0.8em",
	},
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  justified: {
    textAlign: "justify",
  },
  box: {
    display: "flex",
  },
  boxLeft: {
    justifyContent: "flex-start",
  },
  boxRight: {
    justifyContent: "flex-end",
  },
  sup: {
    fontSize: "0.8em",
  },
  scrollableContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1em",
    minHeight: "5em",
    //maxHeight: heightScrollable,
  },
  scrollable: {
    height: "100%",
    overflowY: "auto",
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: "3em",
  },
  attention: {
    backgroundColor: theme.palette.attention.main,
    color: "white",
    fontWeight: "bold",
  }
}));

const TabContainer = React.memo(props => {
  return (
    <div>
      {props.children}
    </div>
  );
});
TabContainer.propTypes = {
};
TabContainer.defaultProps = {
};

const TabBodyScrollable = React.memo(props => {
  const classes = useStyles();

  /**
   * Note: here we assume fixed sections height...
   * this is a bad hack to have a scrollable body
   * and avoid a scrollable container for any
   * window height and consistent after a resize
   */
  const size = useWindowSize();

  return (
    <div className={classes.scrollableContainer}>
      <div className={classes.scrollable} style={{margin: "auto", width: "90%", height: Math.max(120, size.height - config.ui.toolbarHeight - config.ui.tabbarHeight - config.ui.footerHeight)}}>
        {props.children}
      </div>
    </div>
  );
});
TabBodyScrollable.propTypes = {
};
TabBodyScrollable.defaultProps = {
};

const TabTitle = React.memo(props => {
  const classes = useStyles();
  return (
    <div className={classes.centered}>
      <h2>{props.children}</h2>
    </div>
  );
});
TabTitle.propTypes = {
};
TabTitle.defaultProps = {
};

const TabParagraph = React.memo(props => {
  const classes = useStyles();
  return (
    <Box component="div" mb={1}>
      <Typography component="div" className={`${classes.paragraph} ${classes.justified} ${props.small ? classes.paragraphSmall : null} ${props.class}`}>
        {props.children}
      </Typography>
    </Box>
  );
});
TabParagraph.propTypes = {
  class: PropTypes.string,
};
TabParagraph.defaultProps = {
  class: null,
};

const TabBox = React.memo(props => {
  //const classes = useStyles();
  return (
    <Box
      sx={{
        mx: { xs: "5%", md: "20%" },
        mb: "1em",
        p: 1,
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.300",
        borderRadius: 2,
        fontSize: "1em",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {props.children}
    </Box>
  );
});
TabBox.propTypes = {
  class: PropTypes.string,
};
TabBox.defaultProps = {
  class: null,
};

const TabResetButton = React.memo(props => {
  const classes = useStyles();
  return (
    <Box
      component="span"
      m={1} // margin
      className={`${classes.reset}`}
    >
      <Button
        variant="contained"
        title={props.title}
        color="attention"
        className={classes.attention}
        onClick={props.onClick}
        disabled={props.isDisabled}
      >
        {props.children}
      </Button>
    </Box>
  );
});
TabResetButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
TabResetButton.defaultProps = {
  isDisabled: false,
};

const TabPrevButton = React.memo(props => {
  const classes = useStyles();
  return (
    <Box
      component="span"
      m={1} // margin
      className={`${classes.box} ${classes.boxLeft}`}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={props.onPrev}
        disabled={!props.prevIsEnabled}
      >
        {props.children}
      </Button>
    </Box>
  );
});
TabPrevButton.propTypes = {
  onPrev: PropTypes.func.isRequired,
  prevIsEnabled: PropTypes.bool.isRequired,
};
TabPrevButton.defaultProps = {
};

const TabNextButton = React.memo(props => {
  const classes = useStyles();
  return (
    <Box
      component="span"
      m={1} // margin
      className={`${classes.box} ${classes.boxRight}`}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={props.onNext}
        disabled={!props.nextIsEnabled}
      >
        {props.children}
      </Button>
    </Box>
  );
});
TabNextButton.propTypes = {
  onNext: PropTypes.func.isRequired,
  nextIsEnabled: PropTypes.bool.isRequired,
};
TabNextButton.defaultProps = {
};

const TabTooltip = React.memo(props => {
  const classes = useStyles();
  return (
    <Tooltip
      title={props.title}
      placement="top"
    >
      <sup className={classes.sup}>{props.anchor}</sup>
    </Tooltip>
  );
});
TabTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  anchor: PropTypes.string,
};
TabTooltip.defaultProps = {
  anchor: "*",
};

export {TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabBox, TabResetButton, TabPrevButton, TabNextButton, TabTooltip};
