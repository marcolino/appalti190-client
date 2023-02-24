import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { useAxiosLoader } from "../hooks/useAxiosLoader";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import JobService from "../services/JobService";



function Tab07Publish(props) {
  const { t } = useTranslation();
  const [ loading ] = useAxiosLoader();
  const [ prevIsEnabled, ] = useState(true);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(() => props.job?.datasetDownloaded !== undefined ? props.job.datasetDownloaded : false);
  const [ forceVerifyPublished, setForceVerifyPublished ] = useState(false);
  const publishUrlFile = props.job?.transform?.metadati?.urlFile;
  const fileToMatch = props.job?.transform?.outputFile;

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  async function onVerifyPublished() {
    setForceVerifyPublished(true);
  };

  useEffect(() => {
    if (props.job && props.job.transform) {
      if (!props.job?.datasetIsPublished || forceVerifyPublished) {
      (async () => {
        setForceVerifyPublished(false);
        await JobService.urlExistenceAndMatch(publishUrlFile, fileToMatch).then(
          result => {
            props.setJob({...props.job, datasetIsPublished: result.data.published, datasetIsPublishedAsIs: result.data.publishedAsIs});
            setNextIsEnabled(result?.data?.published && result?.data?.publishedAsIs);
          },
          error => {
console.error("Tab06DownloadDataset error:", error);
            toast.error(errorMessage(error));
            setNextIsEnabled(false);
            //props.setJob({...props.job, outcome: error.response.data.message});
            //props.goto("prev");
          }
        );
      })();
    }
  }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job.transform, props.job.outcome, forceVerifyPublished]);

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Publish downloaded dataset")}
        </TabTitle>
        {props.job?.transform?.outputFile && (
          <>
            <TabParagraph>
              {loading && (
                `${t("Checking")}...`
              )}
              {!loading && !props.job.datasetIsPublished && (
                `🔴 ${t(`Dataset is not published yet at address {{publishUrlFile}}`, {publishUrlFile})}`
              )}
              {!loading && props.job.datasetIsPublished && !props.job.datasetIsPublishedAsIs && (
                `🔴 ${t(`Dataset is published at address {{publishUrlFile}}, but differs from produced dataset`, {publishUrlFile})}`
              )}
              {!loading && props.job.datasetIsPublished && props.job.datasetIsPublishedAsIs && (
                `🟢 ${t(`Dataset is correctly published at address {{publishUrlFile}}`, {publishUrlFile})}`
              )}
            </TabParagraph>
            <TabParagraph>
              {!loading && (
                <>
                  <br />
                  <Button onClick={onVerifyPublished} variant="contained" color="tertiary">
                    {t("Verify publication now")} 🌍
                  </Button>
                </>
              )}
            </TabParagraph>

            {/*<pre>
              JOB: {JSON.stringify(props.job, null, 2)}
              </pre>*/}

          </>
        )}
      </TabBodyScrollable>

      <Grid container>
        <Grid item xs={6}>
          <TabPrevButton onPrev={onPrev} prevIsEnabled={prevIsEnabled}>
            {t("Back")}
          </TabPrevButton>
        </Grid>
        <Grid item xs={6}>
          <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
            {t("Continue")}
          </TabNextButton>
        </Grid>
      </Grid>

    </TabContainer>
  );
}
Tab07Publish.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab07Publish.defaultProps = {
};

export default React.memo(Tab07Publish);
