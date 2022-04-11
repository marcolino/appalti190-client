import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
import { JobContext } from "../providers/JobProvider";
import JobService from "../services/JobService";

function Tab06Validation(props) {
  const { t } = useTranslation();
  const { job, setJob } = useContext(JobContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    if (props.value === props.index) {
      if (job && job.transform && !job.outcome) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.outcomeCheck(
            job.transform.metadati.annoRiferimento,
            job.transform.header.codiceFiscaleStrutturaProponente
          ).then(
            result => {
              if (result instanceof Error) {
                toast.error(errorMessage(result));
                return setStatusLocal({ error: errorMessage(result)});
              }
              setJob({...job, outcome: result.data.result});
              setStatusLocal({success: result.data});
              setNextIsEnabled(true);
            },
            error => {
              console.log("OC ERROR REQ:", error.request.data);
              console.log("OC ERROR RES:", error.response.data);
              toast.error(errorMessage(error));
              setJob({...job, outcome: error.response.data.message});
              return setStatusLocal({ error: errorMessage(error)});
            }
          );
        })();
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props/*, job, setJob*/]);

  const onNext = () => {
    props.goto("next");
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Attendi la validazione da parte dell'ANAC")}
        </TabTitle>
        <TabParagraph>
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
        {statusLocal && "success" in statusLocal && (job?.outcome?.esitoUltimoTentativoAccessoUrl === "successo") && (
          <pre>
            <img src="images/success.ico" width="64" alt="success"></img> {job?.outcome?.dataUltimoTentativoAccessoUrl}
          </pre>
        )}
        {((statusLocal && "success" in statusLocal) || (statusLocal && "error" in statusLocal)) && (
          <pre>
            {
              JSON.stringify(job, null, 2)
            }
          </pre>
        )}
      </TabBodyScrollable>

      <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
        {`${t("Continue")}`}
      </TabNextButton>
    </TabContainer>
  );
}
Tab06Validation.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab06Validation.defaultProps = {
};

export default React.memo(Tab06Validation);