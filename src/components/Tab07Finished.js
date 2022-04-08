import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph } from "./TabsComponents";

function Tab07Finished(props) {
  const { t } = useTranslation();
  const [ statusLocal, setStatusLocal ] = useState({});

  useEffect(() => {
    if (props.value === props.index) {
      (async () => {
        setStatusLocal({loading: true});
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props]);

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
