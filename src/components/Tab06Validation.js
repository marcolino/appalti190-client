import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import JobService from "../services/JobService";



function Tab06Validation(props) {
  const { t } = useTranslation();
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  const [ prevIsEnabled ] = useState(true);

  useEffect(() => {
    if (props.job && props.job.transform) {
      if (props.job.outcome) {
        setNextIsEnabled(true);
        setStatusLocal({success: props.job.outcome.esitoUltimoTentativoAccessoUrl === "successo"});
      } else {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.outcomeCheck(
            props.job?.transform?.metadati?.annoRiferimento,
            props.job?.transform?.header?.codiceFiscaleStrutturaProponente
          ).then(
            result => {
              if (result instanceof Error) {
                toast.error(errorMessage(result));
                return setStatusLocal({ error: errorMessage(result)});
              }
              //console.log("OUTCOMECHECK result:", result);
              props.setJob({...props.job, outcome: result.data});
              setStatusLocal({success: result.data});
              setNextIsEnabled(true);
            },
            error => {
              toast.error(errorMessage(error));
              props.setJob({...props.job, outcome: error.response.data.message});
              return setStatusLocal({ error: errorMessage(error)});
            }
          );
        })();
      }
    }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job.transform, props.job.outcome]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  //if (!props.active) return null;
  
  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Wait for ANAC validation")}
        </TabTitle>
        <TabParagraph>
          {statusLocal && "success" in statusLocal && (props.job?.outcome?.esitoUltimoTentativoAccessoUrl === "successo") && (
            <pre>
              <img src="images/success.ico" width="64" alt="success"></img> {props.job?.outcome?.dataUltimoTentativoAccessoUrl}
            </pre>
          )}
          <pre>
            JOB: {JSON.stringify(props.job, null, 2)}
          </pre>
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
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

    </TabContainer>
  );
}
Tab06Validation.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab06Validation.defaultProps = {
};

export default React.memo(Tab06Validation);
