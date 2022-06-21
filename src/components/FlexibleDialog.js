import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const FlexibleDialog = ({ title, contentText, actions, ...props }) => (
  <Dialog
    {...props}
    onBackdropClick={() => {} /* disable modal close on backdrop click */}
    //disableScrollLock={false}
    //disableEnforceFocus={false}
    aria-labelledby={title}
    onClose={(event, reason) => { /* console.log("REASON:", reason); */ }}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{contentText}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={() => {
            action.callback();
            if (action.closeModal) props.onClose();
          }}
          variant={action.variant === "primary" ? "contained" : action.variant === "secondary" ? "outlined" : "contained"}
          autoFocus={props}
          style={{textTransform: "none"}} // do not uppercase button text
        >
          {action.text}
        </Button>
      ))}
    </DialogActions>
  </Dialog>
);

FlexibleDialog.propTypes = {
  title: PropTypes.string,
  contentText: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      closeModal: PropTypes.bool,
      callback: PropTypes.func,
      variant: PropTypes.oneOf([
        "primary", "secondary",
      ]),
      autoFocus: PropTypes.bool,
    })
  ),
};

FlexibleDialog.defaultProps = {
  title: "",
  contentText: "",
  actions: [
    {
      text: "Ok",
      closeModal: true,
      callback: () => {},
      variant: "primary",
      autoFocus: false,
    }
  ],
};

export default React.memo(FlexibleDialog);