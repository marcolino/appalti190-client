import React, { useState, useEffect } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import AccountCircleOutlined from "@material-ui/icons/AccountCircleOutlined";
import ConfirmationNumber from "@material-ui/icons/ConfirmationNumber";
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import { errorMessage } from "../../libs/Misc";
import AuthService from "../../services/AuthService";
import { toast } from "../Toast";
import { FormInput, FormButton, FormText, FormLink } from "../FormElements";
import { validateEmail, validatePassword } from "../../libs/Validation";
import Dialog from "../Dialog";

import config from "../../config";

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.success.main,
  },
  columnLeft: {
    marginLeft: theme.spacing(0.2),
  },
  columnRight: {
    marginLeft: "auto",
    marginRight: theme.spacing(0.2),
  },
  fieldset: {
    border: 0,
  },
});
const useStyles = makeStyles((theme) => (styles(theme)));



function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [codeDeliveryMedium, setCodeDeliveryMedium] = useState("");
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState({});
  const [formState, setFormState] = useState({ xs: true, horizontalSpacing: 0 });
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

  // set up event listener to set correct grid rowSpacing based on inner width
  useEffect(() => {
    const setResponsiveness = () => {
      window.innerWidth < config.extraSmallWatershed
        ? setFormState((prevState) => ({ ...prevState, xs: true, rowSpacing: 0 }))
        : setFormState((prevState) => ({ ...prevState, xs: false, rowSpacing: 2 }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const validateFormStep1 = () => {
    // validate email formally
    if (!validateEmail(email)) {
      const err = t("Please supply a valid email");
      setError({ email: err });
      toast.warning(err);
      return false;
    }

    // check for password presence
    if (!password) {
      const err = t("Please supply a password");
      setError({ password: err });
      toast.warning(err);
      return false;
    }

    // check password for minimum complexity
    if (!validatePassword(password)) {
      const err = t("Please supply a more complex password");
      setError({ password: err });
      toast.warning(err);
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
      setError({ passwordConfirmed: err });
      toast.warning(err);
      return false;
    }

    return true;
  };

  const validateFormStep2 = () => {
    const err = t("The confirmed password does not match the password");
    if (code.length <= 0) {
      setError({ code: err });
      return false;
    }
    return true;
  };

  const formSignUp = (e) => {
    e.preventDefault();
    if (!validateFormStep1()) return;
    setError({});

    AuthService.signup({
      email,
      password,
      firstName,
      lastName
    }).then(
      result => {
        if (result instanceof Error) { // TODO: test this code...
          switch (result.response.data.code) {
            case "EmailExistsException":
              setError({ email: errorMessage(result) }); // since we use email as username, we blame email field as guilty
              //toast.warning(errorMessage(result));
              openDialog(
                t("Email exists already"),
                t("This email is already present") + `.\n` +
                //errorMessage(result) + `\n` +
                t("Do you want to sign in with that email?"),
                [
                  {
                    text: t("Ok"),
                    close: true,
                    callback: () => history.push("/signin"),
                  },
                  {
                    text: t("No, I will retry with a different email"),
                    close: true,
                  }

                ],
              );
      
              break;
            default:
              setError({}); // we don't know whom to blame
              toast.error(errorMessage(result));
          }
          return;
        }
        console.info(`signup code sent to ${email}`);
        //EventBus.dispatch("login");
        //history.push("/");
        const medium = result?.codeDeliveryMedium?.toLowerCase();
        toast.info(t("Confirmation code just sent by {{medium}}", {medium}));
        setCodeDeliveryMedium(medium);
        setWaitingForCode(true);
      },
    );
  };

  const formConfirmSignUp = (e) => {
    e.preventDefault();
    if (!validateFormStep2()) return;
    setError({});

    AuthService.signupConfirm({
      email,
      code
    }).then(
      result => {
        if (result instanceof Error) { // TODO: test this code...
          console.error("signupConfirm error:", result);
          toast.error(errorMessage(result));
          return setError({ code: result.message });
        }
        console.info(`signup complete for ${email}`);
        openDialog(
          t("Registered successfully"),
          t("You can now sign in with email and password") + ".",
          [
            {
              text: t("Ok"),
              close: true,
              callback: formSignUpCompleted,
            }
          ],
        );
      },
    );
  };
  
  const formResendSignUpCode = (e) => {
    e.preventDefault();
    setError({});
    //console.log("resendSignUpCode email:", email);
    AuthService.resendSignUpCode({
      email,
    }).then(
      result => {
        if (result instanceof Error) { // TODO: test this code...
          console.error("signupConfirm error:", result);
          toast.error(errorMessage(result));
          return setError({ code: errorMessage(result) });
        }
        //console.log("resendSignUpCode success:", result);
        toast.info(t("Code resent successfully by {{codeDeliveryMedium}}", {codeDeliveryMedium}));
      }
    );
  };
  
  const formSignUpCompleted = () => {
    setWaitingForCode(false);
    setEmail("");
    setCode("");
    history.push("/signin");
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
                  <AccountCircleOutlined />
                </Avatar>
              </Grid>

              <Box m={3} />

              <Grid container justifyContent="flex-start">
                <FormText>
                  {t("Register with your data")}
                </FormText>
              </Grid>

              <Box m={1} />

              <Grid container direction={"row"} spacing={formState.rowSpacing} >
                <Grid item xs={12} sm={6}>
                  <FormInput
                    autoFocus
                    id={"firstName"}
                    value={firstName}
                    onChange={setFirstName}
                    placeholder={t("First Name")}
                    startAdornmentIcon={<Person />}
                    error={error.firstName}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    id={"lastName"}
                    value={lastName}
                    onChange={setLastName}
                    placeholder={t("Last Name")}
                    startAdornmentIcon={<Person />}
                    error={error.lastName}
                  />
                </Grid>
              </Grid>

              <FormInput
                id={"email"}
                value={email}
                onChange={setEmail}
                placeholder={t("Email")}
                startAdornmentIcon={<Email />}
                error={error.email}
              />

              <FormInput
                id={"password"}
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={t("Password")}
                startAdornmentIcon={<Lock />}
                error={error.password}
              />

              <FormInput
                id={"passwordConfirmed"}
                type="password"
                value={passwordConfirmed}
                onChange={setPasswordConfirmed}
                placeholder={t("Password confirmation")}
                startAdornmentIcon={<Lock />}
                error={error.passwordConfirmed}
              />

              <Box m={1} />

              <FormButton
                onClick={formSignUp}
              >
                {t("Sign Up")}
              </FormButton>

              <Box m={3} />

              <Grid container justifyContent="flex-start">
                <FormText component="h6" variant="caption" color="textSecondary" align="center">
                  {t("By signing up you agree to our")} <FormLink component={RouterLink} to="/terms-of-use" color="textPrimary">{t("terms of use")}</FormLink> {" "}
                  {t("and you confirm you have read our")} <FormLink component={RouterLink} to="/privacy-policy" color="textPrimary">{t("privacy policy")}</FormLink>
                  {", "} {t("including cookie use")} {"."}
                </FormText>
              </Grid>

              <Box m={1} />

            </>
          )}
          {waitingForCode && (
            <>
              <FormInput
                id={"signUpCode"}
                type="number"
                value={code}
                onChange={setCode}
                placeholder={t("Numeric code just received by {{codeDeliveryMedium}}", {codeDeliveryMedium})}
                startAdornmentIcon={<ConfirmationNumber />}
                error={error.code}
              />

              <FormButton
                onClick={formConfirmSignUp}
              >
                {t("Confirm Sign Up")}
              </FormButton>

              <Grid container justifyContent="flex-end">
                <FormButton
                  onClick={formResendSignUpCode}
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

export default React.memo(SignUp);
