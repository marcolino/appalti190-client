import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
//import { transformXls2Xml } from "../libs/Fetch";
import { ServiceContext } from "../providers/ServiceProvider";
import JobService from "../services/JobService";

function Tab06Validation(props) { // TODO: we need file here...
  const { t } = useTranslation();
  //const { service, setService } = useContext(ServiceContext);
  const { service, setService } = useContext(ServiceContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    console.log("PROPS:", props);
    if (props.value === props.index) {
      if (!service.outcome) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.outcomeCheck().then(
            response => {
    console.log("outcomeCheck XXX:", response);
              if (!response) { // TODO: response.ok ? ...
                toast.error(errorMessage(response.message));
                setStatusLocal({error: response.message});
                return;
              }
              console.log("outcomeCheck success:", response.data);
              // TODO: tell user, and enable CONTINUE button...
              setService({...service, outcome: response.data.result});
              setStatusLocal({success: response.data});
              setNextIsEnabled(true);
            },
            error => { // TODO...
              console.error('outcome check error:', error);
              toast.error(errorMessage(error));
            }
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