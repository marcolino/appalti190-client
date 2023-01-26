import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModal } from "mui-modal-provider";
import { makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import Lock from "@mui/icons-material/Lock";
import LockOpen from "@mui/icons-material/LockOpen";
import { errorMessage } from "../../libs/Misc";
import AuthService from "../../services/AuthService";
import { toast } from "../Toast";
import { FormInput, FormButton, FormText, FormLink } from "../FormElements";
import { validateEmail, validatePassword } from "../../libs/Validation";
import FlexibleDialog from "../FlexibleDialog";

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.success.main,
  },
  fieldset: {
    border: 0,
  },
  title: {
    width: "100%",
    color: theme.palette.title.color,
    //backgroundColor: '#ccc', //theme.palette.title.backgroundColor,
    //borderRadius: 3,
    display: "flex",
    justifyContent: "center",
    paddingTop: 3,
    paddingBottom: 50,
    paddingLeft: 10,
    paddingRight: 10,
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
  const history = useHistory();
  const { t } = useTranslation();
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

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
        if (result instanceof Error) {
          toast.error(errorMessage(result));
          return setError({ email: errorMessage(result)});
        }
        setWaitingForCode(true);
        setPassword("");
        switch (result.codeDeliveryMedium) {
          default: // in future we could treat EMAIL/SMS/... separately...
            const medium = result.codeDeliveryMedium;
            setCodeDeliveryMedium(medium);
            openDialog({
              title: t("Verification code sent"),
              contentText:
                ///////t("Verification code sent via {{medium}} to {{email}}", {medium, email}) + ".\n" +
                t("Please copy and paste it here") + ".",
                actions: [
                  {
                    text: t("Ok"),
                    closeModal: true,
                    autoFocus: true,
                    callback: console.log("Ok"),
                  },
                ],
            });
        }
      },
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
        if (result instanceof Error) {
console.log("EC", result.response.data.code, Object.keys(result), Object.values(result));
          const code = result.response.data.code;
          toast.error(errorMessage(result));
          return code === "code" ? 
            setError({ confirmationCode: errorMessage(result) }) :
            setError({ password: errorMessage(result) })
          ;
        }
        setWaitingForCode(false);
        setEmail("");
        setPassword("");
        setPasswordConfirmed("");
        setCode("");
        openDialog({
          title: t("Password reset success"),
          contentText: t("You can now sign in with your new password"),
          actions: [
            {
              text: t("Ok"),
              autoFocus: true,
              closeModal: true,
              callback: () => history.push("/signin"),
            }
          ],
        });
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
        toast.info(`A verification code has been sent via ${result.codeDeliveryMedium} to ${email}`);
        //toast.info("Code resent successfully");
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
                <FormText variant="subtitle1" className={classes.title}>
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

              <Box m={2} />

              <Grid container justifyContent="flex-end">
                <FormLink
                  decoration="underline"
                  onClick={formResendResetPasswordCode}
                >
                  {t("Resend code")}
                </FormLink>
              </Grid>

            </>
          )}
        </fieldset>
      </form>

    </Container>
  );
}

export default React.memo(ForgotPassword);