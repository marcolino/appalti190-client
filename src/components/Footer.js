import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import i18n from "i18next";
import IconCustom from "./IconCustom";
import { isAuthLocation } from "../libs/Misc";
//import { getCurrentLanguage } from "../libs/I18n";
import config from "../config";
import packageJson from "../package.alias.json";

const useStyles = makeStyles(theme => ({
	footer: {
    fontStyle: "italic",
	},
}));

function Footer(props) {
  const location = useLocation();
	const classes = useStyles();
  const { t } = useTranslation();
  const on = t("on"), off = t("off");
  //const [language, setLanguage] = useState(navigator.language.slice(0, 2).toLowerCase());
  const [language, setLanguage] = useState(i18n.language);
  const [languageIcon, setLanguageIcon] = useState(config.languages.supported[language].icon);
  //const languageIcon = config.languages.supported[navigator.language.slice(0, 2).toLowerCase()].icon; // TODO: do something safer...

  const changeLanguage = () => { // simply toggle en <=> it, just to debug
    const lang = (language === "it" ? "en" : "it");
    setLanguageIcon(config.languages.supported[lang].icon);
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
    setLanguage(lang);
  }

  return isAuthLocation(location) ? null : ( // hide footer while in auth screens
    <Container className={classes.footer}>
      <Grid container justifyContent="center">
        <Typography component="h6" variant="body2" color={"textSecondary"}>
          {packageJson.name} {" "}
          {"v"}{packageJson.version} {" ~ "}
          {"©"} {" "} {new Date().getFullYear()}, {" "}
          <Link color="inherit" href={config.companyHomeSiteUrl}>
            {config.companyName}
          </Link>
          <span>&emsp;</span>
          <span onClick={() => changeLanguage()}>{languageIcon}</span>
          <span>&emsp;</span>
          <IconCustom name={`Network.${props.isOnline ? "on" : "off"}`} fill="red" size={12} alt={t("Network connection indicator")} title={t("Network connection is {{how}}", { how: props.isOnline ? on : off })} />
        </Typography>
      </Grid>
    </Container>
  );
}

export default React.memo(Footer);
