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
import TokenService from "../services/TokenService";
import JobService from "../services/JobService";
import FlexibleDialog from "./FlexibleDialog";
import config from "../config";

const useStyles = makeStyles(theme => ({
  '& .MuiTypography-root': {
    _fontSize: "0.5em",
  },
  accordionRoot: {
    _height: "4em",
    _padding: 0,
    _margin: 0,
    fontSize: "0.9em",
  },
  danger: {
    color: theme.palette.error.dark,
    fontWeight: "bold",
  }
}));
//const useStyles = makeStyles((theme) => (styles(theme)));


function Tab05Produce(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const user = TokenService.getUser();
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ info, setInfo ] = useState([]);
  const [ results, setResults ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(props.job?.transform?.code === "OK");
  const [ prevIsEnabled] = useState(true);
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

  useEffect(() => {
    if (props.job?.transform) {
      if (props.job?.transform?.truncatedDueToPlanLimit) {
        if (!props.job?.transform?.planUpgradeDeclined) { // TODO: when will we reset this flag?
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
                text: t("Proceed with the first {{cigNumberAllowed}} CIGs", { cigNumberAllowed: user?.plan?.cigNumberAllowed }),
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
    if (props.job.file && !props.job.transform) {
      (async () => {
        setStatusLocal({...statusLocal, loading: "transform"});
        setStatusLocal(state => ({...state, loading: "transform" }));
        await JobService.transformXls2Xml(props.job.file.path).then(
          response => {
console.log("JobService.transformXls2Xml response:", response);
            setStatusLocal(state => ({...state, loading: null }));
            if (response.data.result.code !== "OK") {
              props.setJob({...props.job, transform: response.data.result});
              return setStatusLocal(state => ({...state, error: response.data.result.message }));
            }
            props.setJob({...props.job, transform: response.data.result});
            setStatusLocal(state => ({...state, success: "transform" }));
            massageTransformationResults(response.data.result);
            setNextIsEnabled(errorsFromResults().length === 0);
          },
          error => {
console.log("JobService.transformXls2Xml error:", error);
            props.setJob({...props.job, transform: error});
            return setResults(state => ({...state, error}));
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (props.job?.file && props.job?.transform && (props.job?.transform?.code === "OK") && !props.job?.validateXml) {
      (async () => {
        setStatusLocal(state => ({...state, loading: "validateXml"}));
        await JobService.validateXml(props.job.transform).then(
          response => {
            setStatusLocal(state => ({...state, loading: null }));
            if (response.data.result.code !== "OK") {
              props.setJob({...props.job, validateXml: response.data.result});
              return setStatusLocal(state => ({...state, error: response.data.result.message }));
            }
            props.setJob({...props.job, validateXml: response?.data.result});
            setStatusLocal(state => ({...state, success: "validateXml"}));
            massageValidateXmlResults(response?.data.result);
          },
          error => {
            props.setJob({...props.job, validateXml: error});
            return setResults(state => ({...state, error}));
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job.transform]);


  useEffect(() => {
    if (props.job.validateXml) {
      massageInfo();
    }
  }, [props.job]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  const massageTransformationResults = (transform) => {
    // massage warnings/errors from transformation
    const s = results ?? {};
    s.results = s.results ? s.results : [];

    // transformation warnings preparation
    if (transform?.warnings?.length) {
      let results = transform?.warnings.map((warning, index) => {
        let type = "TRANSFORM_WARNING";
        let header = `${t("transformation warning")} ${index + 1}`;
        let content = warning;
        return { type, header, content };
      });
      s.results = s.results.concat(results);
    }

    // transformation errors preparation
    if (transform?.errors?.length) {
      let results = transform?.errors.map((error, index) => {
        let type = "TRANSFORM_ERRPR";
        let header = `${t("transformation error")} ${index + 1}`;
        let content = error;
        return { type, header, content };
      });
      s.results = s.results.concat(results);
    }
    setResults(state => ({...state, results: s.results}));
  }

  const massageValidateXmlResults = (validateXml) => {
    // massage warnings/errors from xml validation
    const s = results ?? {};
    s.results = s.results ? s.results : [];

    if (validateXml?.message) {
      let results = validateXml.message.split("\n");
      let pattern = /^\t\[([^\]]+)\]\s*([^:]*):\s*(.*)$/;
      results.shift(); // first line is a title
      results = results.map(result => {
        let type = "VALIDATE_XML_ERROR";
        let header = `xml validation ${result.replace(pattern, "$1")}: ${result.replace(pattern, "$2")}`;
        let content = result.replace(pattern, "$3");
        return { type, header, content };
      });
      s.results = s.results.concat(results);
    }
    setResults(state => ({...state, results: s.results}));
  }

  const massageInfo = () => { // info preparation
    let info = [];
    if (props.job?.file) info[t("Original file name")] = props.job.file.originalname;
    if (props.job?.transform?.metadati?.titolo) info[t("Title")] = props.job.transform.metadati.titolo;
    if (props.job?.transform?.metadati?.abstract) info[t("Abstract")] = props.job.transform.metadati.abstract;
    if (props.job?.transform?.metadati?.dataPubblicazioneDataset) info[t("Dataset publish date")] = props.job.transform.metadati.dataPubblicazioneDataset;
    if (props.job?.transform?.metadati?.dataUltimoAggiornamentoDataset) info[t("Dateset last update date")] = props.job.transform.metadati.dataUltimoAggiornamentoDataset;
    if (props.job?.transform?.metadati?.entePubblicatore) info[t("Publishing body")] = props.job.transform.metadati.entePubblicatore;
    if (props.job?.transform?.metadati?.annoRiferimento) info[t("Reference year")] = props.job.transform.metadati.annoRiferimento;
    if (props.job?.transform?.metadati?.urlFile) info[t("Url file")] = props.job.transform.metadati.urlFile;
    if (props.job?.transform?.rownum) info[t("Number of source rows")] = props.job.transform.rownum;
    if (props.job?.transform?.cigCount) info[t("Number of CIGs")] = props.job.transform?.cigCount
    if (props.job?.transform?.importoAggiudicazioneTotale) info[t("Total award amount")] = `${config.currency.default} ${props.job.transform.importoAggiudicazioneTotale}`;
    if (props.job?.transform?.importoSommeLiquidateTotale) info[t("Total liquidated amount")] = `${config.currency.default} ${props.job.transform.importoSommeLiquidateTotale}`;
      setInfo(info);
  }

  const warningsFromResults = () => {
    return results.results?.filter((row) => row.type === "TRANSFORM_WARNING" || row.type === "VALIDATE_XML_WARNING") ?? [];
  }

  const errorsFromResults = () => {
    return results.results?.filter((row) => row.type === "TRANSFORM_ERROR" || row.type === "VALIDATE_XML_ERROR") ?? [];
  }

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Produce XML dataset")}
        </TabTitle>
        <TabParagraph>
          {statusLocal && "loading" in statusLocal && statusLocal.loading === "transform" && `🟡 ${t("Transforming XLS to XML...")}`}
          {statusLocal && "loading" in statusLocal && statusLocal.loading === "validateXml" && `🟡 ${t("Validating...")}`}
          {statusLocal && "error" in statusLocal && `🔴 ${t("Errors in validation")}: ${statusLocal.error}`}
          {/* {statusLocal && "success" in statusLocal && statusLocal.success === "validateXml" && `🟢 ${t("Validation completed")}`} */}
        </TabParagraph>

        {props.job?.transform?.truncatedDueToPlanLimit && (
          <TabParagraph>
            <Typography align="center" className={classes.danger}>{t("Warning")}: {t("The produced dataset has been truncated to {{cigs}} CIGs; you can proceed and downoad it, but file is not to be published", {cigs: user?.plan?.cigNumberAllowed})}.</Typography>
            <br />
          </TabParagraph>
        )}

        {props.job?.transform?.outputFile && (
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

        {(props.job?.transform?.outputFile &&
          errorsFromResults().length === 0 &&
          warningsFromResults().length === 0) && (
          <Typography>🟢 {t("Validation completed successfully")}</Typography>
        )}

        {(errorsFromResults().length > 0) && (
          <div style={{color: "darkred"}}>
            <TabParagraph>
              <Accordion disableGutters={true} classes={{ root: classes.accordionRoot }} style={{color:"darkred"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-error-content`}
                  id={`panel-error-header`}
                >
                  <Typography>🔴 {`${errorsFromResults().length} ${t("errors")}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {errorsFromResults().map((error, index) => (
                    <div key={index} style={{borderTop: "1px solid #ddd", paddingTop: 5}}>
                      {1 + index}) {error.type}: {error.content}
                    </div>
                  ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </TabParagraph>
          </div>
        )}

        {(warningsFromResults().length > 0) && (
          <div style={{color: "darkorange"}}>
            <TabParagraph>
              <Accordion disableGutters={true} classes={{ root: classes.accordionRoot }} style={{color: "orange"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-warning-content`}
                  id={`panel-warning-header`}
                >
                  <Typography>🟠 {`${warningsFromResults().length} ${t("warnings")}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {warningsFromResults().map((error, index) => (
                    <div key={index} style={{borderTop: "1px solid #ddd", paddingTop: 5}}>
                      {1 + index}) {error.type}: {error.content}
                    </div>
                  ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </TabParagraph>
          </div>
        )}

      </TabBodyScrollable>

      {/* <pre>
        JOB: {JSON.stringify(props.job, null, 2)}
      </pre> */}

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

    </TabContainer>
  );
}

Tab05Produce.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab05Produce.defaultProps = {
};

export default React.memo(Tab05Produce);
