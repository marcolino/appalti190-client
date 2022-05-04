import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AuthService from "../services/AuthService";
import TokenService from "../services/TokenService";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import Dialog from "./Dialog";
import config from "../config";



function Tab02Download(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [ prevIsEnabled, ] = useState(true);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(() => props.job?.download ? props.job?.download : false);
  const [ dialogTitle, setDialogTitle ] = useState(null);
  const [ dialogContent, setDialogContent ] = useState(null);
  const [ dialogButtons, setDialogButtons ] = useState([]);
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const openDialog = (title, content, buttons) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogButtons(buttons);
    setDialogOpen(true);    
  }

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  const userIsAuthenticated = () => {
    if (!AuthService.getCurrentUser()) { // user is not authenticated
      openDialog(
        t("Please log in or register"),
        t("You need to be authenticated to proceed"),
        [
          {
            text: t("Login"),
            close: true,
            callback: () => {
              TokenService.set("redirect", props.tabId);
              history.push("/signin");
            },
          },
          {
            text: t("Register"),
            close: true,
            callback: () => history.push("/signup"),
          },
          {
            text: t("Cancel"),
            close: true,
          }
        ],
      );
      return false;
    }
    return true;
  }

  const onDownload = () => {
    if (userIsAuthenticated()) {
      const link = document.createElement("a");
      link.download = config.data.templateDownloadName;
      link.href = config.data.templateDownloadLink;
      link.click();
      setNextIsEnabled(true);
      props.setJob({...props.job, download: true});
    }
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Download")}
        </TabTitle>
        <TabParagraph>
          Scarica il modello Excel in cui potrai inserire i dati degli appalti, uno per riga.
        </TabParagraph>
        <TabParagraph>
          <Button onClick={onDownload} variant="contained" color="primary">
            {t("Download")} ⬇
          </Button>
        </TabParagraph>
        {/* <br />
        <TabParagraph small>
          <input type="checkbox"></input>
          Clicca qui se preferisci la versione ODS (Open Document Format),
          nel caso che tu utilizzi LibreOffice anziché Microsoft Office.
        </TabParagraph> */}
      </TabBodyScrollable>

      <Grid container>
        <Grid item xs={6}>
          <TabPrevButton onPrev={onPrev} prevIsEnabled={prevIsEnabled}>
            {`${t("Back")}`}
          </TabPrevButton>
        </Grid>
        <Grid item xs={6}>
          <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
            {`${t("Continue")}`}
          </TabNextButton>
        </Grid>
      </Grid>

      <Dialog
        dialogOpen={dialogOpen}
        dialogSetOpen={setDialogOpen}
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        dialogButtons={dialogButtons}
      />

    </TabContainer>
  );
}
Tab02Download.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab02Download.defaultProps = {
};

export default React.memo(Tab02Download);
