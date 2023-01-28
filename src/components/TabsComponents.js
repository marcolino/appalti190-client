import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import useWindowSize from "../hooks/useWindowSize";

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

  // scrollableContainer: {
  //   width: "100%",
  //   height: "100%",
  //   display: "flex",
  //   flexDirection: "column",
  //   flexWrap: "nowrap",
  // },
  // scrollableHeader: {
  //   flexShrink: 0,
  // },
  // scrollableBody: {
  //   flexGrow: 1,
  //   overflow: "auto",
  //   minHeight: "3em",
  // },
  // scrollableFooter: {
  //   flexShrink: 0,
  // },
}));

const TabContainer = React.memo(props => {
  //const classes = useStyles();
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
  const toolbarHeight = 90; // toolbar height
  const tabbarHeight = 100; // tabbbar height
  const footerHeight = 90; // footer height (TODO: put this in config.ui. ... ?)
  const size = useWindowSize();

  return (
    <div className={classes.scrollableContainer}>
      <div className={classes.scrollable} style={{height: Math.max(120, size.height - toolbarHeight - tabbarHeight - /*titleHeight - */footerHeight)}}>
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
    <Box mb={1}>
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
        // fullWidth={props.fullWidth}
        // variant={props.variant}
        // color={props.color}
        // size={props.size}
        // className={`${classes.button} ${props.social ? classes.buttonFederated : ""} ${props.social ? classes["buttonFederated" + capitalize(props.social)] : ""} ${classes[props.className]}`}
        // startIcon={props.startIcon}
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

export {TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton, TabTooltip};