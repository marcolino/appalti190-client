import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { AuthContext } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
	listings: {
    fontSize: "1.5em",
	},
}));



function Listings() {
	const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className={classes.listings}>
      {`${t("Listings")} ${t("for")} ${auth.isAuthenticated ? t("authenticated user") : t("guest user")} ${auth.isAuthenticated ? auth.user.attributes.email : ""}`}
    </div>
  );
}

export default React.memo(Listings);