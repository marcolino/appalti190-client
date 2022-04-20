import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton } from "./TabsComponents";

function Tab07Finished(props) {
  const { t } = useTranslation();
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ prevIsEnabled ] = useState(true);

  useEffect(() => {
    if (props.value === props.index) {
      (async () => {
        setStatusLocal({loading: true});
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props]);

  const onPrev = () => {
    props.goto("prev");
  };

  if (!props.active) return null;
  
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

      <Grid container>
        <Grid item xs={6}>
          <TabPrevButton onPrev={onPrev} prevIsEnabled={prevIsEnabled}>
            {`${t("Back")}`}
          </TabPrevButton>
        </Grid>
      </Grid>

    </TabContainer>
  );
}
Tab07Finished.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab07Finished.defaultProps = {
};

export default React.memo(Tab07Finished);
