import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
//import Button from "@material-ui/core/Button";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
//import { transformXls2Xml } from "../libs/Fetch";
import { ServiceContext } from "../providers/ServiceProvider";
import JobService from "../services/JobService";

function Tab05Check(props) { // TODO: we need file here...
  const { t } = useTranslation();
  const { service, setService } = useContext(ServiceContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    console.log("PROPS:", props);
    console.log("SERVICE:", service);
    //if (service.file) {
    //if (props.value === props.index) {
    if (props.active) {
      (async () => {
      setStatusLocal({loading: true});
      await JobService.transformXls2Xml(service.file.path).then(
        response => {
console.log("transformXls2Xml XXX:", response);
          if (!response) { // TODO: response.ok ? ...
            //console.warn("transformXls2Xml error:", JSON.stringify(data));
            // TODO: ok?
            toast.error(errorMessage(response.message));
            setStatusLocal({error: response.message});
            return;
          }
          console.log("transformXls2Xml success:", response.data);
          // TODO: tell user, and enable CONTINUE button...
          setService({...service, transform: response.data});
          setStatusLocal({success: response.data});
          setNextIsEnabled(true);
        },
        error => { // TODO...
          console.error('Upload error:', error);
          toast.error(errorMessage(error));
        }
      );
      })();
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