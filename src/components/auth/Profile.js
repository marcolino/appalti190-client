import React/*, { useState }*/ from "react";
//import { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
//import { AuthContext } from "../../providers/AuthProvider";
import AuthService from "../../services/AuthService";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
	profile: {
    fontSize: "1.5em",
	},
}));

function Profile() {
	const classes = useStyles();
  //const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

  // TODO: if (auth.user) useEffect(fetch("/api/user")) ...

  return (
    <div className={classes.profile}>
      {//(typeof currentUser/*auth.user*/ !== "undefined") && // if auth.user is undefined, we don't know yet about user authentication...
        `${t("Profile")} ${t("for")} ${currentUser ? t("authenticated user") : t("guest user")} ${currentUser ? currentUser.email : ""}`
      }
      {(typeof currentUser !== "undefined") &&
        JSON.stringify(currentUser)
      }
   </div>
  );
}

export default React.memo(Profile);