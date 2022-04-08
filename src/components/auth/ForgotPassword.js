import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import LockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import ConfirmationNumber from "@material-ui/icons/ConfirmationNumber";
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";
import { errorMessage } from "../../libs/Misc";
import AuthService from "../../services/AuthService";
import { toast } from "../Toast";
import { FormInput, FormButton, FormText } from "../FormElements";
import { validateEmail, validatePassword } from "../../libs/Validation";
import Dialog from "../Dialog";

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.success.main,
  },
  fieldset: {
    border: 0,
  },
});
const useStyles = makeStyles((theme) => (styles(theme)));

function ForgotPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [error, setError] = useState({ email: null, password: null, passwordConfirmed: null, code: null });
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [codeDeliveryMedium, setCodeDeliveryMedium] = useState("");
  const [code, setCode] = useState("");
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogButtons, setDialogButtons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { t } = useTranslation();
 
  const openDialog = (title, content, buttons) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogButtons(buttons);
    setDialogOpen(true);    
  }

  const validateForm = () => { // validate email formally
    if (!waitingForCode) {
      if (!validateEmail(email)) {
        const err = t("Please supply a valid email");
        toast.warning(err);
        setError({ email: err });
        return false;
      }
    }

    if (waitingForCode) {
      if (!validatePassword(password)) {
        const err = t("Please supply a more complex password");
        toast.warning(err);
        setError({ password: err });
        return false;
      }

      if (!passwordConfirmed) {
        const err = t("Please confirm the password");
        setError({ passwordConfirmed: err });
        toast.warning(err);
        return false;
      }
  
      if (password !== passwordConfirmed) {
        const err = t("The confirmed password does not match the password");
        toast.warning(err);
        setError({ passwordConfirmed: err });
        return false;
      }
    }

    return true;
  }

  const formForgotPassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    AuthService.forgotPassword({email}).then(
      (result) => {
        if (result instanceof Error) { // TODO: always handle errors this way!
          toast.error(errorMessage(result));
          return setError({ email: errorMessage(result)});
        }
        setWaitingForCode(true);
        setPassword("");
        switch (result.codeDeliveryMedium) {
          default: // in future we could treat EMAIL/SMS/... separately...
            const medium = result.codeDeliveryMedium;
            setCodeDeliveryMedium(medium);
            openDialog(
              t("Verification code sent"),
              t(`Verification code sent via {{medium}} to {{email}}.`, {medium, email}) + `\n` +
              t(`Please copy and paste it here.`),
              // [
              //   {
              //     text: t("Ok"),
              //     close: true,
              //     callback: () => console.log("Post OK close action"),
              //   }
              // ]
            );
        }
      },
//       (error) => { // TODO: THIS IS NEVER REACHED!!!
// console.error("E forgotPassword error:", error);
//         toast.error(errorMessage(error));
//         setError({ email: errorMessage(error)}); // TODO: always do setError( ... errorMessage(error) ...)
//       }
    );
  };
  
  const formConfirmForgotPassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});
    
    AuthService.resetPasswordConfirm({
      email,
      password,
      code,
    }).then(
      result => {
        if (result instanceof Error) { // TODO: test this code...
          toast.error(errorMessage(error));
          return setError({ password: errorMessage(error)}); // TODO: which field to blame?
        }
        setWaitingForCode(false);
        setEmail("");
        setPassword("");
        setPasswordConfirmed("");
        setCode("");
        openDialog(
          t(`Password reset success`),
          t(`You can now sign in with your new password`),
          // [
          //   {
          //     text: t("Ok"),
          //     close: true,
          //     callback: () => console.log("Post OK close action"),
          //   }
          // ]
        );
      },
    );
  };
  
  const formResendResetPasswordCode = (e) => {
    e.preventDefault();
    setError({});

    AuthService.resendResetPasswordCode({
      email
    }).then(
      result => {
        if (result instanceof Error) {
          setError({ confirmationCode: errorMessage(result) }); // blame confirmationCode field
          toast.error(errorMessage(result));
          return;
        }
        // TODO: CHECK IF IN DATA WE HAVE MESSAGE TO SHOW TO THE USER resendResetPasswordCode
  console.log("CHECK IF IN DATA WE HAVE MESSAGE TO SHOW TO THE USER resendResetPasswordCode", result);
        toast.info("Code resent successfully");
      }
    );
  };

  return (
    <Container maxWidth="xs">

      <form className={classes.form} noValidate autoComplete="off">
        <fieldset /*disabled={promiseInProgress}*/ className={classes.fieldset}>
          {!waitingForCode && (
            <>

              <Box m={1} />

              <Grid container justifyContent="center">
                <Avatar className={classes.avatar}>
                  <LockOpenOutlined />
                </Avatar>
              </Grid>

              <Box m={3} />

              <Grid container justifyContent="flex-start">
                <FormText>
                  {t("Reset password")}
                </FormText>
              </Grid>

              <Box m={1} />

              <FormInput
                autoFocus
                id={"email"}
                value={email}
                onChange={setEmail}
                placeholder={t("Email")}
                startAdornmentIcon={<LockOpen />}
                error={error.email}
              />

              <Box m={1} />

              <FormButton
                onClick={formForgotPassword}
              >
                {t("Request password reset")}
              </FormButton>
              
            </>
          )}
          {waitingForCode && (
            <>

              <FormInput
                id={"password"}
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={t("New password")}
                startAdornmentIcon={<Lock />}
                error={error.password}
              />

              <FormInput
                id={"passwordConfirmed"}
                type="password"
                value={passwordConfirmed}
                onChange={setPasswordConfirmed}
                placeholder={t("New password confirmation")}
                startAdornmentIcon={<Lock />}
                error={error.passwordConfirmed}
              />

              <FormInput
                id={"confirmationCode"}
                type="number"
                value={code}
                onChange={setCode}
                placeholder={t("Numeric code just received by {{codeDeliveryMedium}}", {codeDeliveryMedium})}
                startAdornmentIcon={<ConfirmationNumber />}
                error={error.confirmationCode}
              />

              <Box m={1} />

              <FormButton
                onClick={formConfirmForgotPassword}
              >
                {t("Confirm Password Reset")}
              </FormButton>

              <Grid container justifyContent="flex-end">
                <FormButton
                  onClick={formResendResetPasswordCode}
                  fullWidth={false}
                  className={"buttonSecondary"}
                >
                  {t("Resend code")}
                </FormButton>
              </Grid>

            </>
          )}
        </fieldset>
      </form>

      <Dialog
        dialogOpen={dialogOpen}
        dialogSetOpen={setDialogOpen}
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        dialogButtons={dialogButtons}
      />

    </Container>
  );
}

export default React.memo(ForgotPassword);