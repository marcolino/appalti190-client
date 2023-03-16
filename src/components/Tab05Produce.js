import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModal } from "mui-modal-provider";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import { toast } from "./Toast";
import FlexibleDialog from "./FlexibleDialog";
import { useAxiosLoader } from "../hooks/useAxiosLoader";
import TokenService from "../services/TokenService";
import JobService from "../services/JobService";
import { errorMessage } from "../libs/Misc";
import config from "../config";

const useStyles = makeStyles(theme => ({
  accordionRoot: {
    fontSize: "0.9em",
  },
  danger: {
    color: theme.palette.error.dark,
    fontWeight: "bold",
  }
}));



function Tab05Produce(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const user = TokenService.getUser();
  const [ loading ] = useAxiosLoader();
  const [ info, setInfo ] = useState([]);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(props.job?.transform?.code === "OK");
  const [ prevIsEnabled] = useState(true);
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

  useEffect(() => {
    if (props.job?.transform) {
      if (props.job?.transform?.truncatedDueToPlanLimit) {
        if (!props.job?.transform?.planUpgradeDeclined) {
          openDialog({
            title: t("Please upgrade your plan"),
            contentText: 
              t("You need to upgrade your plan to proceed.") + "\n" +
              t("Your current plan is \"{{planName}}\".", { planName: user?.plan?.name}) + "\n" +
              t("To elaborate {{cigCount}} CIGs you need at least plan \"{{planName}}\"", { cigCount: props.job?.transform?.cigCount, planName: props.job?.transform?.planRequired?.name }),
            actions: [
              {
                text: t("Upgrade plan"),
                closeModal: true,
                autoFocus: true,
                callback: () => {
                  TokenService.set("redirect", props.tabId);
                  history.push("/profile", { tabValue: 1 }); // redirect to /profile route, to second tab, where plan can be changed
                },
              },
              {
                text:
                  (user?.plan?.cigNumberAllowed === Number.MAX_SAFE_INTEGER) ?
                    t("Proceed with unlimited CIG's")
                  :
                    t("Proceed with the first {{cigNumberAllowed}} CIGs", { cigNumberAllowed: user?.plan?.cigNumberAllowed }),
                closeModal: true,
                callback: () => {
                  props.setJob({...props.job, transform: {...props.job?.transform, planUpgradeDeclined: true}});
                },
              },
            ],
          });
        }
      }
    }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job?.transform]);

  useEffect(() => {
    if (props.job?.file && !props.job?.transform) {
      (async () => {
        await JobService.transformXls2Xml(props.job.file.path).then(
          response => {
            props.setJob({...props.job, transform: response?.data});
          },
          error => {
            toast.error(errorMessage(error));
            //props.goto("prev");
          },
        );
      })();
    }
  }, []);

  useEffect(() => {
    if (props.job?.file && (props.job?.transform?.code === "OK") && !props.job?.validateXml) {
      (async () => {
        await JobService.validateXml(props.job.transform).then(
          response => {
            props.setJob({...props.job, validateXml: response?.data});
            setNextIsEnabled(props.job?.transform?.code === "OK" && response?.data?.code === "OK" && allErrors().length === 0);
          },
          error => {
            toast.error(errorMessage(error));
            setNextIsEnabled(false);
            //props.goto("prev");
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job?.transform?.code]);


  useEffect(() => {
    if (props.job?.validateXml) {
      reclaimInfo();
    }
  }, [props.job]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  const reclaimInfo = () => { // info preparation
    let info = [];
    if (props.job?.file) info[t("Original file name")] = props.job.file.originalname;
    if (props.job?.transform?.metadati?.titolo) info[t("Title")] = props.job.transform.metadati.titolo;
    //if (props.job?.transform?.metadati?.abstract) info[t("Abstract")] = props.job.transform.metadati.abstract;
    //if (props.job?.transform?.metadati?.dataPubblicazioneDataset) info[t("Dataset publish date")] = props.job.transform.metadati.dataPubblicazioneDataset;
    //if (props.job?.transform?.metadati?.dataUltimoAggiornamentoDataset) info[t("Dateset last update date")] = props.job.transform.metadati.dataUltimoAggiornamentoDataset;
    //if (props.job?.transform?.metadati?.entePubblicatore) info[t("Publishing body")] = props.job.transform.metadati.entePubblicatore;
    if (props.job?.transform?.metadati?.annoRiferimento) info[t("Reference year")] = props.job.transform.metadati.annoRiferimento;
    //if (props.job?.transform?.metadati?.urlFile) info[t("Url file")] = props.job.transform.metadati.urlFile;
    if (props.job?.transform?.rownum) info[t("Number of source rows")] = props.job.transform.rownum;
    if (props.job?.transform?.cigCount) info[t("Number of CIGs")] = props.job.transform?.cigCount
    if (props.job?.transform?.importoAggiudicazioneTotale) info[t("Total award amount")] = `${config.currency.default} ${props.job.transform.importoAggiudicazioneTotale}`;
    if (props.job?.transform?.importoSommeLiquidateTotale) info[t("Total liquidated amount")] = `${config.currency.default} ${props.job.transform.importoSommeLiquidateTotale}`;
    setInfo(info);
console.log("INFO1:", info);
  }

  const allWarnings = () => {
    const transformWarnings = props.job?.transform?.warnings ?? [];
    const validateXmlWarnings = props.job?.validateXml?.warnings ?? [];
    return transformWarnings.concat(validateXmlWarnings);
  }

  const allErrors = () => {
    const transformErrors = props.job?.transform?.errors ?? [];
    const validateXmlErrors = props.job?.validateXml?.errors ?? [];
    return transformErrors.concat(validateXmlErrors);
  }

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Produce XML dataset")}
        </TabTitle>
        <TabParagraph>
          {loading && `🟡 ${t("Transforming XLS to XML and validating...")}`}
          {/* {statusLocal.loading === "transform" && `🟡 ${t("Transforming XLS to XML...")}`}
          {statusLocal.loading === "validateXml" && `🟡 ${t("Validating...")}`} */}
        </TabParagraph>
        {(props.job?.transform?.truncatedDueToPlanLimit && (user?.plan?.cigNumberAllowed < Number.MAX_SAFE_INTEGER)) && (
          <TabParagraph>
            <Typography align="center" className={classes.danger}>{t("Warning")}: {t("The produced dataset has been truncated to {{cigs}} CIGs; you can proceed and downoad it, but file is not to be published", {cigs: user?.plan?.cigNumberAllowed})}.</Typography>
            <br />
          </TabParagraph>
        )}

        {props.job?.transform?.outputFile && (Object.keys(info).length > 0) && (
          <Grid
            container
            sx={{ overflowY: "auto", maxHeight: "300" }}
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Card sx={{backgroundColor: "#eee"}}>
                <CardContent>
                  {Object.keys(info).map((key, index) => (
                    <Typography sx={{fontSize: ".8em" }} color="text.secondary" key={index}>{key}: {info[key]}</Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {(!loading &&
          props.job?.transform && (props.job?.transform?.code !== "OK" && props.job?.transform?.message) &&
          <Typography>🔴 {props.job?.transform?.message}</Typography>
        )}
        {(!loading &&
          props.job?.validateXml && (props.job?.validateXml?.code !== "OK" && props.job?.validateXml?.message) &&
          <Typography>🔴 {props.job?.validateXml?.message}</Typography>
        )}
        {(!loading &&
          props.job?.transform?.code === "OK" &&
          props.job?.transform?.outputFile &&
          props.job?.validateXml?.code === "OK" &&
          allErrors().length === 0 &&
          allWarnings().length === 0) && (
          <Typography>🟢 {t("Production and validation completed successfully")}</Typography>
        )}

        {(allErrors().length > 0) && (
          <span style={{color: "darkred"}}>
            <TabParagraph>
              <Accordion disableGutters={true} classes={{ root: classes.accordionRoot }} style={{color:"darkred"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-error-content`}
                  id={`panel-error-header`}
                >
                  <Typography>🔴 {`${allErrors().length} ${t("errors")}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {allErrors().map((error, index) => (
                    <div key={index} style={{borderTop: "1px solid #ddd", paddingTop: 5}}>
                      {1 + index}) {error}
                    </div>
                  ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </TabParagraph>
          </span>
        )}

        {(allWarnings().length > 0) && (
          <span style={{color: "darkorange"}}>
            <TabParagraph>
              <Accordion disableGutters={true} classes={{ root: classes.accordionRoot }} style={{color: "orange"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-warning-content`}
                  id={`panel-warning-header`}
                >
                  <Typography>🟠 {`${allWarnings().length} ${t("warnings")}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {allWarnings().map((warning, index) => (
                    <div key={index} style={{borderTop: "1px solid #ddd", paddingTop: 5}}>
                      {1 + index}) {warning}
                    </div>
                  ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </TabParagraph>
          </span>
        )}

      </TabBodyScrollable>

      <Grid container className={classes.root}>
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

      {/* <pre>
        JOB: {JSON.stringify(props.job, null, 2)}
      </pre> */}

    </TabContainer>
  );
}

Tab05Produce.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab05Produce.defaultProps = {
};

export default React.memo(Tab05Produce);
