import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Grid, Button } from "@mui/material";
import { toast } from "./Toast";
import { errorMessage, dateToLocaleDate } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import { useAxiosLoader } from "../hooks/useAxiosLoader";
import JobService from "../services/JobService";



function Tab08Validation(props) {
  const { t } = useTranslation();
  const [ loading ] = useAxiosLoader();
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  const [ prevIsEnabled ] = useState(true);
  const [ forceCheckValidated, setForceCheckValidated ] = useState(!props.job?.outcome?.esitoUltimoTentativoAccessoUrl);

  async function onCheckValidated() {
    setForceCheckValidated(true);
  };

  useEffect(() => {
    if (props.job?.transform) {
      if (props.job?.outcome?.esitoUltimoTentativoAccessoUrl) {
        setNextIsEnabled(props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "successo");
      }
      if (forceCheckValidated) {
        (async () => {
          await JobService.outcomeCheck(
            props.job?.transform?.metadati?.annoRiferimento,
            props.job?.transform?.header?.codiceFiscaleStrutturaProponente
          ).then(
            result => {
              setForceCheckValidated(false);
console.log("OUTCOMECHECK result:", result?.data?.result);
              props.setJob({...props.job, outcome: result?.data?.result});
              setNextIsEnabled(result.data?.result?.esitoUltimoTentativoAccessoUrl === "successo");
            },
            error => {
              toast.error(errorMessage(error));
              setNextIsEnabled(false);
              //props.goto("prev");
            }
          );
        })();
      }
    }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job.transform, forceCheckValidated]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  const tentativiAccessoUrlLast = props.job?.outcome?.tentativiAccessoUrl?.length - 1;
  const listaAccessoRisorsaLast = (tentativiAccessoUrlLast >= 0 ? props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.listaAccessoRisorsa?.length - 1 : -1);

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Check ANAC validation")}
        </TabTitle>
        <TabParagraph>
          {loading && (
            `${t("Checking")}...`
          )}
          {!loading && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "in corso") && (
            `🟡 ${t("attempt in progress")}...`
          )}
          {!loading && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "successo") && (
            `🟢 ${t("last attempt succeeded")}`
          )}
          {!loading && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "fallito") && (
            `🔴 ${t("last attempt failed")}`
          )}
        </TabParagraph>
        {!loading && (
          <div style={{fontSize: "0.8em", marginLeft: "3em"}}>
            <TabParagraph>
              <i>{t("last verification date")}:</i> {props.job?.outcome?.dataUltimoTentativoAccessoUrl ? dateToLocaleDate(props.job?.outcome?.dataUltimoTentativoAccessoUrl) : t("never")}
            </TabParagraph>
          </div>
        )} 
        {!loading && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "fallito") && (
          <div style={{fontSize: "0.8em", marginLeft: "3em"}}>
            <TabParagraph>
              <i>{t("outcome code")}:</i> {props.job?.outcome?.esitoComunicazione?.codice ?? "?"}
            </TabParagraph>
            <TabParagraph>
              <i>{t("outcome description")}:</i> {props.job?.outcome?.esitoComunicazione?.descrizione ?? "?"}
            </TabParagraph>
            <TabParagraph>
              <i>{t("outcome detail")}:</i> {props.job?.outcome?.esitoComunicazione?.dettaglio ?? "?"}
            </TabParagraph>
          </div>
        )}
        {!loading && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "fallito") && (tentativiAccessoUrlLast >= 0) && (
          <div style={{fontSize: "0.8em", marginLeft: "3em"}}>
            <TabParagraph>
              <i>{t("last attempt to access url outcome code")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.esito?.codice ?? "?"}
            </TabParagraph>
            <TabParagraph>
              <i>{t("last attempt to access url outcome description")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.esito?.descrizione ?? "?"}
            </TabParagraph>
          </div>
        )}
        {!loading && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "fallito") && (tentativiAccessoUrlLast >= 0) && (listaAccessoRisorsaLast >= 0) && (
          <div style={{fontSize: "0.8em", marginLeft: "3em"}}>
            <TabParagraph>
              <i>{t("last attempt to access resource")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.listaAccessoRisorsa[listaAccessoRisorsaLast]?.url ?? "?"}
            </TabParagraph>
            <TabParagraph>
              <i>{t("last attempt to access resource xml valid")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.listaAccessoRisorsa[listaAccessoRisorsaLast]?.xmlValido ? t("yes") : t("no")}
            </TabParagraph>
            <TabParagraph>
              <i>{t("last attempt to access resource xml validation")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.listaAccessoRisorsa[listaAccessoRisorsaLast]?.dettaglioValidazioneXml ?? t("(empty)")}
            </TabParagraph>
            <TabParagraph>
              <i>{t("last attempt to access resource code")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.listaAccessoRisorsa[listaAccessoRisorsaLast]?.esitoAccessoRisorsa?.codice ?? "?"}
            </TabParagraph>
            <TabParagraph>
              <i>{t("last attempt to access resource description")}:</i> {props.job?.outcome?.tentativiAccessoUrl[tentativiAccessoUrlLast]?.listaAccessoRisorsa[listaAccessoRisorsaLast]?.esitoAccessoRisorsa?.descrizione ?? "?"}
            </TabParagraph>
          </div>
        )}
        <br />
        <TabParagraph>
          {props.job.datasetIsPublished && !(props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "successo") && (
            <Button onClick={onCheckValidated} variant="contained" color="tertiary">
              {t("Check validation now")} 🎯
            </Button>
          )}
        </TabParagraph>
        
        {/* <pre>
          JOB: {JSON.stringify(props.job, null, 2)}
        </pre> */}

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
Tab08Validation.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab08Validation.defaultProps = {
};

export default React.memo(Tab08Validation);
