import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { signIn, federatedSignIn } from "../AuthPromise";
import { usePromiseTracker } from "react-promise-tracker";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Person from "@material-ui/icons/Person";
import Lock from "@material-ui/icons/Lock";
import { FacebookIcon, GoogleIcon } from "../IconFederated";
import { toast } from "../Toasts";
import { FormInput, FormButton, FormText, FormDividerWithText, FormCheckbox, FormLink } from "../FormElements";
import { AuthContext } from "../../providers/AuthProvider";
import { OnlineStatusContext } from "../../providers/OnlineStatusProvider";
import { validateEmail } from "../../libs/Validation";
import config from "../../config.json";

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.success.main,
  },
  rememberMe: {
    color: theme.palette.success.main,
  },
  forgotPassword: {
    color: theme.palette.success.main,
  },
  signUp: {
    color: theme.palette.success.main,
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



export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState({});
  const { setAuth } = useContext(AuthContext);
  const isOnline = useContext(OnlineStatusContext);
  const { promiseInProgress } = usePromiseTracker({delay: config.spinner.delay});

  const validateForm = () => {
    
    // validate email formally
    if (!validateEmail(email)) {
      const err = "Please supply a valid email";
      setError({ email: err });
      toast.warning(err);
      return false;
    }

    if (!password) {
      const err = "Please supply a password";
      setError({ password: err });
      toast.warning(err);
      return false;
    }

    return true;
  };

  const formSignIn = (e) => {
    e.preventDefault();
    if (promiseInProgress) return;
    if (!validateForm()) return;
    // TODO: centralize this message, it is used more than once...
    if (!isOnline) return toast.warning("Sorry, we are currently offline. Please wait for the network to become available.");
    setError({});

    signIn({
      username: email,
      password,
    }, {
      success: (user) => {
        setAuth({isAuthenticated: true, user});
        if (!rememberMe) {
          localStorage.clear();
        }
        setEmail("");
        setPassword("");
        history.push("/");
      },
      error: (err) => {
        console.error("signIn error data:", err);
        toast.error(err.message);
        setError({}); // we don't know whom to blame
      },
    });
  };

  const formFederatedSignIn = (e, provider) => {
    e.preventDefault();
    if (promiseInProgress) return;
    // TODO: centralize this message, it is used more than once...
    if (!isOnline) return toast.warning("You are currently offline. Please wait for the network to become available.");

    federatedSignIn({provider}, {
      success: (user) => {
        //console.log("federatedSignIn user:", user); // always undefined, at this moment...
      },
      error: (err) => {
        console.error("federatedSignIn error data:", err);
        toast.error(err);
        setError({}); // we don't know whom to blame
      },
    });
  };

  return (
    <Container maxWidth="xs">

      <form className={classes.form} noValidate autoComplete="off">
        <fieldset disabled={promiseInProgress} className={classes.fieldset}>

          <Box m={0} />

          <Grid container justifyContent="center">
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>

          <Box m={2} />

          <Grid container justifyContent="flex-start">
            <FormText>
              {"Sign in with email and password"}
            </FormText>
          </Grid>

          <Box m={0} />

          <FormInput
            id={"email"}
            value={email}
            onChange={setEmail}
            placeholder={"Email"}
            startAdornmentIcon={<Person />}
            error={error.email}
          />

          <FormInput
            id={"password"}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={"Password"}
            startAdornmentIcon={<Lock />}
            error={error.password}
          />

          <Box m={1} />

          <FormButton
            onClick={formSignIn}
          >
            {"Sign In"}
          </FormButton>

          <Grid container alignItems="center">
            <Grid className={classes.columnLeft}>
              <FormCheckbox
                checked={rememberMe}
                onChange={setRememberMe}
                className={classes.rememberMe}
              >
                {"Remember me"}
              </FormCheckbox>
            </Grid>
            <Grid className={classes.columnRight}>
              <FormLink
                href="/forgot-password"
                className={classes.forgotPassword}
              >
                {"Forgot Password?"}
              </FormLink>
            </Grid>
          </Grid>

          <Box m={2} />

          <Grid container direction="row" justifyContent="center" spacing={1}>
            <Grid item>
              <FormText>
                {"Don't have an account?"}
              </FormText>
            </Grid>
            <Grid item>
              <FormLink
                href="/signup"
                className={classes.signUp}
              >
                {"Register Now!"}
              </FormLink>
            </Grid>
          </Grid>

          <Box m={3} />

          <FormDividerWithText>
            <FormText>
              <i>{"or"}</i>
            </FormText>
          </FormDividerWithText>

          <Box m={3} />

          <Grid container justifyContent="flex-start">
            <FormText>
              {"Sign in with a social account"}
            </FormText>
          </Grid>

          <Box m={0} />

          <FormButton
            social={"Facebook"}
            startIcon={<FacebookIcon />}
            onClick={(e) => formFederatedSignIn(e, "Facebook")}
          >
            {"Facebook"}
          </FormButton>
          <FormButton
            social={"Google"}
            startIcon={<GoogleIcon />}
            onClick={(e) => formFederatedSignIn(e, "Google")}
          >
            {"Google"}
          </FormButton>

        </fieldset>
      </form>

    </Container>
  );
}
