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
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import TokenService from "../services/TokenService";
import JobService from "../services/JobService";
import FlexibleDialog from "./FlexibleDialog";

const useStyles = makeStyles(theme => ({
  '& .MuiTypography-root': {
    fontSize: "0.5em",
  },
  accordionRoot: {
    _height: "4em",
    _padding: 0,
    _margin: 0,
    fontSize: "0.9em",
  }
}));


function Tab05Check(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const user = TokenService.getUser();
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false/*!!props?.job?.transform?.planUpgradeDeclined*/);
  const [ prevIsEnabled] = useState(true);
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

  useEffect(() => {
console.log("useeffect 1", props.job);
    if (props.job?.transform) {
      if (props.job?.transform?.code === "TRUNCATED_DUE_TO_PLAN_LIMIT") {
        if (!props.job?.transform?.planUpgradeDeclined) { // TODO: when will we reset this flag?
console.log("useeffect 1 ENTERED");
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
                  setNextIsEnabled(true);
                  props.setJob({...props.job, transform: {...props.job?.transform, planUpgradeDeclined: true}});
                },
              },
            ],
          });
        }
      }
    } else {
      setNextIsEnabled(true);
    }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job?.transform]);

  useEffect(() => {
console.log("useeffect 2", props.job);
    if (props.job.file && !props.job.transform) {
console.log("useeffect 2 ENTERED");
      (async () => {
        setStatusLocal({loading: true});
        await JobService.transformXls2Xml(props.job.file.path).then(
          result => {
            if (result instanceof Error) {
              props.setJob({...props.job, transform: result});
              toast.error(errorMessage(result));
              return setStatusLocal({ error: errorMessage(result)});
            }
console.log("useeffect 2 - setting job.transform to:", result.data.result);
            props.setJob({...props.job, transform: result.data.result});
            setStatusLocal({success: result.data});
            //setNextIsEnabled(true);
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []); //props, props.job]);

  useEffect(() => {
console.log("useeffect 3", props.job);
    if (props.job.file && props.job.transform && !props.job.validateXml) {
console.log("useeffect 3 ENTERED");
      (async () => {
        setStatusLocal({loading: true});
        await JobService.validateXml(props.job.transform).then(
          response => {
            if (response instanceof Error) {
              props.setJob({...props.job, validateXml: response});
              //console.log("validateXml error:", response);
              toast.error(errorMessage(response));
              return setStatusLocal({ error: errorMessage(response)});
            }
            //console.log("validateXml success:", response.data);
            props.setJob({...props.job, validateXml: response.data});
            setStatusLocal({success: response.data});
          },
          error => {
            props.setJob({...props.job, validateXml: error});
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job.transform, /*props, setJob*/]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  //if (!props.active) return null;
/*
job.transform.warnings
job.transform.errors
*/

  // outcome results preparation
  let info = [];
  if (props.job?.file) info[t("Original file name")] = props.job.file.originalname;
  if (props.job?.transform?.metadati?.titolo) info[t("Title")] = props.job.transform.metadati.titolo;
  if (props.job?.transform?.metadati?.abstract) info[t("Abstract")] = props.job.transform.metadati.abstract;
  if (props.job?.transform?.metadati?.dataPubblicazioneDataset) info[t("Dataset publish date")] = props.job.transform.metadati.dataPubblicazioneDataset;
  if (props.job?.transform?.metadati?.dataUltimoAggiornamentoDataset) info[t("Dateset last update date")] = props.job.transform.metadati.dataUltimoAggiornamentoDataset;
  if (props.job?.transform?.metadati?.entePubblicatore) info[t("Publishing body")] = props.job.transform.metadati.entePubblicatore;
  if (props.job?.transform?.metadati?.annoRiferimento) info[t("Reference year")] = props.job.transform.metadati.annoRiferimento;
  if (props.job?.transform?.metadati?.urlFile) info[t("Url file")] = props.job.transform.metadati.urlFile;
  if (props.job?.transform?.metadati?.licenza) info[t("License")] = props.job.transform.metadati.licenza;
  if (props.job?.cigCount) info[t("Number of CIGs")] = props.job.cigCount;
  if (props.job?.importoAggiudicazioneTotale) info[t("Total award amount")] = props.job.importoAggiudicazioneTotale;
  if (props.job?.importoSommeLiquidateTotale) info[t("Total liquidated amount")] = props.job.importoSommeLiquidateTotale;
//console.log("info:", info);

  // handle warnings/errors from transformation and xml validation

  // transformation warnings preparation
  let transformationWarningsTitle = "";
  let transformationWarnings = [];
  if (props.job?.transform?.warnings.length) {
    transformationWarningsTitle = `${props.job?.transform?.warnings.length} ${t("transformation warnings")}`;
    transformationWarnings = props.job?.transform?.warnings.map((warning, index) => {
      let type = t("transformation warning");
      let header = `${index + 1}`;
      let content = warning;
      return { type, header, content };
    });
  }

  // transformation errors preparation
  let transformationErrorsTitle = "";
  let transformationErrors = [];
  if (props.job?.transform?.errors.length) {
    transformationErrorsTitle = `${props.job?.transform?.errors.length} ${t("transformation errors")}`;
    transformationErrors = props.job?.transform?.errors.map((error, index) => {
      let type = t("transformation error");
      let header = `${index + 1}`;
      let content = error;
      return { type, header, content };
    });
  }

  // xml validation errors preparation
  let xmlErrorsTitle = props.job?.validateXml?.error?.message;
  let xmlErrorsReason = props.job?.validateXml?.error?.reason;
  let xmlErrors = [];
  if (xmlErrorsReason) {
    xmlErrors = xmlErrorsReason.split("\n");
    let pattern = /^\t\[([^\]]+)\]\s*([^:]*):\s*(.*)$/;
    /* eslint-disable no-unused-vars */
    let xmlErrorsSynopsys = xmlErrors.shift();
    xmlErrorsTitle = `${xmlErrors.length} ${t("xml validation errors")}`; //: ${xmlErrorsTitle} (${xmlErrorsSynopsys})`;
    xmlErrors = xmlErrors.map((reason, index) => {
      let type = `xml validation ${reason.replace(pattern, "$1")}`;
      let header = `${reason.replace(pattern, "$2")}`;
      let content = `${reason.replace(pattern, "$3")}`;
      return { type, header, content };
    });
  }

  const errorsTitle = "<p>".concat(transformationWarningsTitle, "</p><p>", transformationErrorsTitle, "</p><p>", xmlErrorsTitle, "</p>");
  const errors = transformationWarnings.concat(transformationErrors, xmlErrors);
console.log("ERRORS:", errors);
console.log(props.job);

return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Check")}
        </TabTitle>

        <TabParagraph>
          {statusLocal && "loading" in statusLocal && `🟡 ${t("Processing...")}`}
          {statusLocal && "error" in statusLocal && `🔴 ${t("Errors in validation")}: ${statusLocal.error}`}
          {statusLocal && "success" in statusLocal && `🟢 ${t("Validation completed successfully")}`}
        </TabParagraph>

        { (Object.keys(info).length > 0) && (
          <div> {/* TODO: use some better way to display a table of info keys/values ... */}
            {Object.keys(info).map((key, index) => (
              <div key={index}>{key}: {info[key]}</div>
            ))}
          </div>
        )}
        { (errors.length > 0) && (
          <div style={{color: "darkred"}}>
            <TabParagraph>
              {/*<h3>{errorsTitle}</h3>*/}
              <h3 dangerouslySetInnerHTML={{__html: errorsTitle}}></h3>
            </TabParagraph>
            <TabParagraph>
              {errors.map((reason, index) => (
                <Accordion key={index} disableGutters={true} classes={{ root: classes.accordionRoot }} style={{color:"darkred"}} sx={{'& .MuiTypography-root' :{ fontSize: ".7em" }}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-error-${index}-content`}
                    id={`panel-error-${index}-header`}
                  >
                    <Typography>{reason.type}: {reason.header}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {reason.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabParagraph>
          </div>
        )}

      </TabBodyScrollable>

{/*
<pre> props.job: {JSON.stringify(props.job, null, 2)} </pre>
*/}
      {
      }

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

Tab05Check.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab05Check.defaultProps = {
};

export default React.memo(Tab05Check);