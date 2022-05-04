import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton } from "./TabsComponents";

function Tab07Finished(props) {
  const { t } = useTranslation();
  const [ prevIsEnabled ] = useState(true);

  const onPrev = () => {
    props.goto("prev");
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Finished")}!
        </TabTitle>
        <TabParagraph>
          <div style={{fontSize: 128, textAlign: "center"}}>
            🏁
          </div>
        </TabParagraph>
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
