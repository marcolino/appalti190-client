import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import DialogMui from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormButton } from "../components/FormElements";

const Dialog = (props) => {
  return (
    <DialogMui
      open={props.dialogOpen}
      onClose={() => props.dialogSetOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.dialogTitle}
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Typography variant="body1" style={{whiteSpace: "pre-line"}}>
          {props.dialogContent}
        </Typography>
      </DialogContent>
      <DialogActions>
        {props.dialogButtons.map((button, index) => (
          <FormButton
            key={index}
            onClick={() => {
              button.callback && button.callback();
              if (button.close) {
                props.dialogSetOpen(false);
              }
            }}
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus={index === 0}
          >
            {button.text}
          </FormButton>
        ))}
      </DialogActions>
    </DialogMui>
  );
}

Dialog.propTypes = {
  dialogId: PropTypes.string,
  dialogOpen: PropTypes.bool,
  dialogSetOpen: PropTypes.func,
  dialogTitle: PropTypes.string,
  dialogContent: PropTypes.string,
  dialogButtons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      close: PropTypes.bool,
      callback: PropTypes.func,
    })
  ),
};

Dialog.defaultProps = {
  dialogOpen: false,
  dialogButtons: [
    {
      text: "Ok",
      close: true,
      callback: () => {},
    }
  ],
};

export default React.memo(Dialog);