import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
//import Button from "@material-ui/core/Button";
// import { toast } from "./Toast";
// import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph } from "./TabsComponents";
//import { transformXls2Xml } from "../libs/Fetch";
//import { ServiceContext } from "../providers/ServiceProvider";
// import JobService from "../services/JobService";

function Tab07Finished(props) { // TODO: we need file here...
  const { t } = useTranslation();
  //const { service, setService } = useContext(ServiceContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  //const [ nextIsEnabled, setNextIsEnabled ] = useState(false);

  useEffect(() => {
    console.log("PROPS:", props);
    if (props.value === props.index) {
      (async () => {
        setStatusLocal({loading: true});
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props/*, service, setService*/]);

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Finished! 🏁")}
        </TabTitle>
        <TabParagraph>
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
      </TabBodyScrollable>
    </TabContainer>
  );
}
Tab07Finished.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab07Finished.defaultProps = {
};

export default React.memo(Tab07Finished);