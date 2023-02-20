import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton } from "./TabsComponents";
import config from "../config";

function Tab09Finished(props) {
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
        {props.job?.transform?.outputFile && (
          <>
            <TabParagraph>
              <div style={{fontSize: 128, textAlign: "center"}}>
                🏁
              </div>
            </TabParagraph>
            <TabParagraph>
              <div style={{textAlign: "center"}}>
                {t("Compliments, you did comply successfully to {{appTitle}} fulfillments for year {{year}}", {appTitle: config.appTitle, year: props.job?.transform?.metadati?.annoRiferimento})}
              </div>
            </TabParagraph>
          </>
        )}
      </TabBodyScrollable>

      <Grid container>
        <Grid item xs={6}>
          <TabPrevButton onPrev={onPrev} prevIsEnabled={prevIsEnabled}>
            {t("Back")}
          </TabPrevButton>
        </Grid>
      </Grid>

    </TabContainer>
  );
}
Tab09Finished.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab09Finished.defaultProps = {
};

export default React.memo(Tab09Finished);
