import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
//import Button from "@material-ui/core/Button";
import { toast } from "./Toast";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
import { transformXls2Xml } from "../libs/Fetch";
import { ServiceContext } from "../providers/ServiceProvider";

//import config from "../config";

function Tab05Check(props) { // TODO: we need file here...
  const { t } = useTranslation();
  const { service, setService } = useContext(ServiceContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    if (props.value === props.index) {
      //(async () => {
        setStatusLocal({loading: true});
console.log("transformXls2Xml service:", service);       
        transformXls2Xml({file: service.file}).then(response => {
          if (!response.ok) {
            //console.warn("transformXls2Xml error:", JSON.stringify(data));
            // TODO: ok?
            toast.error(t(response.message));
            setStatusLocal({error: response.message});
            return;
          }
          console.log("transformXls2Xml success:", response);
          // TODO: tell user, and enable CONTINUE button...
          setService({...service, transform: response});
          setStatusLocal({success: response});
          setNextIsEnabled(true);
        }/*).catch(err => {
          console.warn("transformXls2Xml error:", err.message, typeof err.message);
          setStatusLocal({error: err.message});
          toast.error(t(err.message));
        }*/);
      //})();
    }
  }, [props, t, /*service,*/ setService]);

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