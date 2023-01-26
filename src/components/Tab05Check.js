import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModal } from "mui-modal-provider";
import Grid from "@mui/material/Grid";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import TokenService from "../services/TokenService";
import JobService from "../services/JobService";
import FlexibleDialog from "./FlexibleDialog";



function Tab05Check(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const user = TokenService.getUser();
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(!!props?.job?.transform?.planUpgradeDeclined);
  const [ prevIsEnabled] = useState(true);
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

  useEffect(() => {
console.log("useeffect 1");
    if (props.job?.transform) {
      if (props.job?.transform?.code === "TRUNCATED_DUE_TO_PLAN_LIMIT") {
        if (!props.job?.transform?.planUpgradeDeclined) { // TODO: when will we reset this flag?
          openDialog({
            title: t("Please upgrade your plan"),
            contentText: 
              t("You need to upgrade your plan to proceed.") + "\n" +
              t("Your current plan is \"{{planName}}\".", { planName: user?.plan?.name}) + "\n" +
              t("To elaborate {{cigCount}} CIGs you need at least plan \"{{planName}}\"", { cigCount: props.job?.transform?.cigCount, planName: props.job?.transform?.planRequired?.name }),
            actions: [
              {
                text: t("Upgrade plan"),
                closeModal: true,
                autoFocus: true,
                callback: () => {
                  TokenService.set("redirect", props.tabId);
                  history.push("/profile", { tabValue: 1 }); // redirect to /profile route, to second tab, where plan can be changed
                },
              },
              {
                text: t("Proceed with the first {{cigNumberAllowed}} CIGs", { cigNumberAllowed: user?.plan?.cigNumberAllowed }),
                closeModal: true,
                callback: () => {
                  setNextIsEnabled(true);
                  props.setJob({...props.job, transform: {...props.job?.transform, planUpgradeDeclined: true}});
                },
              },
            ],
          });
        }
      }
    } else {
      setNextIsEnabled(true);
    }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.job?.transform]);

  useEffect(() => {
console.log("useeffect 2");
    if (props.job.file && !props.job.transform) {
      (async () => {
        setStatusLocal({loading: true});
        await JobService.transformXls2Xml(props.job.file.path).then(
          result => {
            if (result instanceof Error) {
              props.setJob({...props.job, transform: result});
              toast.error(errorMessage(result));
              return setStatusLocal({ error: errorMessage(result)});
            }
            props.setJob({...props.job, transform: result.data.result});
            setStatusLocal({success: result.data});
            //setNextIsEnabled(true);
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []); //props, props.job]);

  useEffect(() => {
console.log("useeffect 3");
    if (props.job.file && props.job.transform && !props.job.validateXml) {
      (async () => {
        setStatusLocal({loading: true});
        await JobService.validateXml(props.job.transform).then(
          response => {
            if (response instanceof Error) {
              props.setJob({...props.job, validateXml: response});
              //console.log("validateXml error:", response);
              toast.error(errorMessage(response));
              return setStatusLocal({ error: errorMessage(response)});
            }
            //console.log("validateXml success:", response.data);
            props.setJob({...props.job, validateXml: response.data});
            setStatusLocal({success: response.data});
          },
          error => {
            props.setJob({...props.job, validateXml: error});
          },
        );
      })();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [/*props, job.transform, setJob*/]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  //if (!props.active) return null;
  
console.log(props.job);
  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Check")}
        </TabTitle>
        <TabParagraph>
          <pre>
             JOB: {JSON.stringify(props.job, null, 2)}
          </pre>
          {statusLocal && "loading" in statusLocal && `Elaborazione in corso...`}
          {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
          {statusLocal && "success" in statusLocal && `Elaborazione completata`}
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
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

Tab05Check.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab05Check.defaultProps = {
};

export default React.memo(Tab05Check);