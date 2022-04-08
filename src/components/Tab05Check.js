import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
import { JobContext } from "../providers/JobProvider";
import JobService from "../services/JobService";

function Tab05Check(props) {
  const { t } = useTranslation();
  const { service, setService } = useContext(JobContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  
  useEffect(() => {
    if (props.active) {
      if (service.file && !service.transform) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.transformXls2Xml(service.file.path).then(
            /*async*/ result => {
              if (result instanceof Error) { // TODO: always handle errors this way!
                setService({...service, transform: result});
                toast.error(errorMessage(result));
                return setStatusLocal({ error: errorMessage(result)});
              }
              setService({...service, transform: result.data.result});
              setStatusLocal({success: result.data});
              //setNextIsEnabled(true);
            },
            // error => {
            //   console.error('transformXls2Xml error:', error);
            //   setService({...service, transform: error}); // to stop repeated calls...
            //   toast.error(errorMessage(error));
            // }
          );
        })();
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props, service/*, setService*/]);

  useEffect(() => {
    if (props.active) {
      if (service.file && service.transform && !service.validateXml) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.validateXml(service.transform).then(
            response => {
              if (response instanceof Error) { // TODO: always handle errors this way!
                setService({...service, validateXml: response});
                toast.error(errorMessage(response));
                return setStatusLocal({ error: errorMessage(response)});
              }
              setService({...service, validateXml: response.data.result});
              setStatusLocal({success: response.data});
              setNextIsEnabled(true);
            },
            // error => {
            //   setService({...service, validateXml: error}); // to stop repeated calls...
            //   toast.error(errorMessage(error));
            // }
          );
        })();
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props, service/*, setService*/]);

  const onNext = () => {
    props.goto("next");
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Check")}
        </TabTitle>
        <TabParagraph>
         {/* SL:  {JSON.stringify(status.service?.transform)} */}
          {statusLocal && "loading" in statusLocal && `Elaborazione in corso...`}
          {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
          {statusLocal && "success" in statusLocal && `Elaborazione completata`}
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
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
Tab05Check.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab05Check.defaultProps = {
};

export default React.memo(Tab05Check);