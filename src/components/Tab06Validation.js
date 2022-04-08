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
  const { service, setService } = useContext(JobContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    if (props.value === props.index) {
      if (!service.outcome) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.outcomeCheck(
            service.transform.metadati.annoRiferimento,
            service.transform.header.codiceFiscaleStrutturaProponente
          ).then(
            result => {
              if (result instanceof Error) { // TODO: always handle errors this way!
                toast.error(errorMessage(result));
                return setStatusLocal({ error: errorMessage(result)});
              }
              setService({...service, outcome: result.data.result});
              setStatusLocal({success: result.data});
              setNextIsEnabled(true);
            },
            // error => { // to be handled...
            //   console.error('outcome check error:', error);
            //   toast.error(errorMessage(error));
            // }
          );
        })();
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props/*, service, setService*/]);

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
        {statusLocal && "success" in statusLocal && (service.outcome.esitoUltimoTentativoAccessoUrl === "successo") && (
          <pre>
            <img src="images/success.ico" width="64" alt="success"></img> {service.outcome.dataUltimoTentativoAccessoUrl}
          </pre>
        )}
        {((statusLocal && "success" in statusLocal) || (statusLocal && "error" in statusLocal)) && (
          <pre>
            {
              JSON.stringify(service, null, 2)
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