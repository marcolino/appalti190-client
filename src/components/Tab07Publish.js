import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import JobService from "../services/JobService";



function Tab07Publish(props) {
  const { t } = useTranslation();
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ prevIsEnabled, ] = useState(true);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(() => props.job?.downloadDataset !== undefined ? props.job.downloadDataset : false);
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
      (async () => {
        setStatusLocal({loading: true});
        setForceVerifyPublished(false);
        await JobService.urlExistenceAndMatch(publishUrlFile, fileToMatch).then(
          result => {
            if (result instanceof Error) {
              toast.error(errorMessage(result));
              return setStatusLocal({loading: false, error: errorMessage(result)});
            }
            props.setJob({...props.job, datasetIsPublished: result.data.published, datasetIsPublishedAsIs: result.data.publishedAsIs});
            setStatusLocal({loading: false, success: true});
console.log("+++ result?.data:", result?.data)
            setNextIsEnabled(result?.data?.published && result?.data?.publishedAsIs);
          },
          error => {
            toast.error(errorMessage(error));
            props.setJob({...props.job, outcome: error.response.data.message});
            return setStatusLocal({ error: errorMessage(error)});
          }
        );
      })();
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
              {(statusLocal.loading) && (
                `🟡`
              )}
              {!(statusLocal.loading) && (!props.job.datasetIsPublished ) && (
                `🔴 ${t(`Dataset is not published yet at address {{publishUrlFile}}`, {publishUrlFile})}`
              )}
              {!(statusLocal.loading) && props.job.datasetIsPublished && !props.job.datasetIsPublishedAsIs && (
                `🔴 ${t(`Dataset is published at address {{publishUrlFile}}, but differs from produced dataset`, {publishUrlFile})}`
              )}
              {!(statusLocal.loading) && props.job.datasetIsPublished && props.job.datasetIsPublishedAsIs && (
                `🟢 ${t(`Dataset is correctly published at address {{publishUrlFile}}`, {publishUrlFile})}`
              )}
            </TabParagraph>
            <TabParagraph>
              {!(statusLocal.loading) && !(props.job.datasetIsPublished) && (
                <span>
                  <p>
                    {t("Please provide to publish downloaded dataset")}.
                  </p>
                  <p>
                    <Button onClick={onVerifyPublished} variant="contained" color="tertiary">
                      {t("Verify publication now")} 🌍
                    </Button>
                  </p>
                </span>
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
