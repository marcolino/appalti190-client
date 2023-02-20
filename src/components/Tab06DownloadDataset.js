import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useModal } from "mui-modal-provider";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AuthService from "../services/AuthService";
import TokenService from "../services/TokenService";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import { downloadRemoteUrl } from "../libs/Misc";
import FlexibleDialog from "./FlexibleDialog";



const useStyles = makeStyles(theme => ({
  danger: {
    color: theme.palette.error.dark,
    fontWeight: "bold",
  }
}));

function Tab06DownloadDataset(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const user = TokenService.getUser();
  const [ prevIsEnabled, ] = useState(true);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(() => !!(props.job?.downloadDataset && !props.job?.transform?.truncatedDueToPlanLimit));
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  const userIsAuthenticated = () => {
    if (!AuthService.getCurrentUser()) { // user is not authenticated
      openDialog({
        title: t("Please log in or register"),
        contentText: t("You need to be authenticated to proceed"),
        actions: [
          {
            text: t("Login"),
            closeModal: true,
            autoFocus: true,
            callback: () => {
              TokenService.set("redirect", props.tabId);
              history.push("/signin");
            },
          },
          {
            text: t("Register"),
            closeModal: true,
            callback: () => {
              TokenService.set("redirect", props.tabId);
              history.push("/signup");
            },
          },
          {
            text: t("Cancel"),
            closeModal: true,
            callback: () => props.goto("prev"),
          }
        ],
      });
      return false;
    }
    return true;
  }

  const onDownloadDataset = () => {
    if (userIsAuthenticated()) {
      //let url = config.service.endpoint + "marco/dataset-2022.xml";
      let url = props.job.transform.outputUrl;
console.log("job:", props.job);
console.log("url:", url);
      downloadRemoteUrl(url);
      setNextIsEnabled(!props.job?.transform?.truncatedDueToPlanLimit);
      props.setJob({...props.job, downloadDataset: true});
    }
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Download produced dataset")}
        </TabTitle>

        {props.job?.transform?.truncatedDueToPlanLimit && (
          <TabParagraph>
            <Typography align="center" className={classes.danger}>{t("Warning")}: {t("The produced dataset has been truncated to {{cigs}} CIGs; you can proceed and downoad it, but file is not to be published", {cigs: user?.plan?.cigNumberAllowed})}.</Typography>
            <br />
          </TabParagraph>
        )}

        {props.job?.transform?.outputFile && (
          <>
            <TabParagraph>
                {t("Download dataset")}.
            </TabParagraph>
            <TabParagraph>
              <Button onClick={onDownloadDataset} variant="contained" color="tertiary">
                {t("Download")} ⤵
              </Button>
            </TabParagraph>
          </>
        )}

      </TabBodyScrollable>

      <Grid container>
        <Grid item xs={6}>
          <TabPrevButton onPrev={onPrev} prevIsEnabled={prevIsEnabled}>
            {t("Back")}
          </TabPrevButton>
        </Grid>
        <Grid item xs={6}>
          <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
            {t("Continue")}
          </TabNextButton>
        </Grid>
      </Grid>

    </TabContainer>
  );
}

Tab06DownloadDataset.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab06DownloadDataset.defaultProps = {
};

export default React.memo(Tab06DownloadDataset);
