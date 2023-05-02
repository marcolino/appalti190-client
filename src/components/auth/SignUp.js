import React, { useState, useEffect } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModal } from "mui-modal-provider";
import { makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import Person from "@mui/icons-material/Person";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { errorMessage } from "../../libs/Misc";
import AuthService from "../../services/AuthService";
import { toast } from "../Toast";
import { FormInput, FormButton, FormText, FormLink } from "../FormElements";
import { validateEmail, validatePassword } from "../../libs/Validation";
import FlexibleDialog from "../FlexibleDialog";
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
  }
});
const useStyles = makeStyles((theme) => (styles(theme)));



function SignUp(props) {
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
  const { t } = useTranslation();
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);



  useEffect(() => { // check user has unverified email; if so, show waiting for code mode
    const query = new URLSearchParams(props.location.search);
    const unverifiedEmail = query.get("unverifiedEmail");
    if (unverifiedEmail) {
      setWaitingForCode(true);
      setCodeDeliveryMedium("email");
      setEmail(unverifiedEmail);
    }
  }, [props]);
  
  // set up event listener to set correct grid rowSpacing based on inner width
  useEffect(() => {
    const setResponsiveness = () => {
      window.innerWidth < config.ui.extraSmallWatershed
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
      lastName,
      address: {
        //street: "Via dei Ciclamini, 0",
        //city: "Florence",
      },
    }).then(
      result => {
        if (result instanceof Error) {
console.info("SIGNUP result:", result)
          switch (result?.response?.data?.code) {
            case "EmailExistsAlready":
              setError({ email: errorMessage(result) }); // since we use email as username, we blame email field as guilty
              openDialog({
                title: t("Email exists already"),
                contentText:
                  t("This email is already present") + `.\n` +
                  t("Do you want to sign in with that email?"),
                actions: [
                  {
                    text: t("Ok"),
                    autoFocus: true,
                    closeModal: true,
                    callback: () => history.push("/signin"),
                  },
                  {
                    text: t("No, I will retry with a different email"),
                    closeModal: true,
                  }
                ],
              });      
              break;
            default:
              setError({}); // we don't know whom to blame
              toast.error(errorMessage(result));
          }
          return;
        }
        console.info(`signup code sent to ${email}`);
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
        if (result instanceof Error) {
          console.error("signupConfirm error:", result);
          toast.error(errorMessage(result));
          return setError({ code: result.message });
        }
        console.info(`signup complete for ${email}`);
        openDialog({
          title: t("Registered successfully"),
          contentText: t("You can now sign in with email and password") + ".",
          actions: [
            {
              text: t("Ok"),
              autoFocus: true,
              closeModal: true,
              callback: formSignUpCompleted,
            },
          ],
        });
      },
    );
  };
  
  const formResendSignUpCode = (e) => {
    e.preventDefault();
    setError({});
    AuthService.resendSignUpCode({
      email,
    }).then(
      result => {
        if (result instanceof Error) {
          toast.error(errorMessage(result));
          return setError({ code: errorMessage(result) });
        }
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
        <fieldset className={classes.fieldset}>
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
                <FormText variant="subtitle1" className={classes.title}>
                  {t("Register with your data")}
                </FormText>
              </Grid>

              <Box m={3} />

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

              <Box m={2} />

              <Grid container justifyContent="flex-end">
                <FormLink
                  decoration="underline"
                  onClick={formResendSignUpCode}
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

export default React.memo(SignUp);
