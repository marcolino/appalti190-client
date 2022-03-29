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

function Tab06Validation(props) { // TODO: we need file here...
  const { t } = useTranslation();
  const { service, setService } = useContext(ServiceContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    console.log("PROPS:", props);
    if (props.value === props.index) {
      (async () => {
      setStatusLocal({loading: true});
/*
      await JobService.transformXls2Xml(service.file.path).then(
        response => {
console.log("transformXls2Xml XXX:", response);
          if (!response) { // TODO...
            //console.warn("transformXls2Xml error:", JSON.stringify(data));
            // TODO: ok?
            toast.error(errorMessage(response.message));
            setStatusLocal({error: response.message});
            return;
          }
          console.log("transformXls2Xml success:", response);
          // TODO: tell user, and enable CONTINUE button...
          setService({...service, transform: response});
          setStatusLocal({success: response});
          setNextIsEnabled(true);
        },
        error => { // TODO...
          console.error('Upload error:', error);
          toast.error(errorMessage(error));
        }
      );
*/
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
          {t("Attendi la validazione da parte dell'ANAC")}
        </TabTitle>
        <TabParagraph>
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
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