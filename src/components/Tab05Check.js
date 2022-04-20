import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
//import { JobContext } from "../providers/JobProvider";
//import jobService from "../services/JobService";
import TokenService from "../services/TokenService";
//import { JobContext } from "../providers/JobProvider";
//import AuthService from "../services/AuthService";
import JobService from "../services/JobService";
import Dialog from "./Dialog";
import { transform } from "@babel/core";

function Tab05Check(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const user = TokenService.getUser();
  //const { job, setJob } = useContext(JobContext);
  //const job = JobService.get();
  //const [ job, setJob ] = useState(TokenService.getJob());
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  const [ prevIsEnabled] = useState(true);
  const [ dialogTitle, setDialogTitle ] = useState(null);
  const [ dialogContent, setDialogContent ] = useState(null);
  const [ dialogButtons, setDialogButtons ] = useState([]);
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const openDialog = (title, content, buttons) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogButtons(buttons);
    setDialogOpen(true);    
  }

  // useEffect(() => { // to serialize job
  //   TokenService.setJob(job);
  // }, [job]);

  //const checkUserPlan = useCallback(async() => {
  const checkUserPlan = async() => {
console.log("************* checkUserPlan, props.job:", props.job);
    if (props.job.transform) {
      if (props.job.transform.code === "TRUNCATED_DUE_TO_PLAN_LIMIT") {
        openDialog(
          t("Please upgrade your plan"),
          t("You need to upgrade your plan to proceed.") + "\n" +
          t(`Your current plan is "${user.plan.name}".`) + "\n" +
          t(`To elaborate ${props.job.transform.cigCount} CIGs you need at least plan "${props.job.transform.planRequired.name}"`),
          [
            {
              text: t("Upgrade plan"),
              close: true,
              callback: () => {
                //TokenService.setRedirect(props.tabId);
                TokenService.set("redirect", props.tabId);
                history.push("/profile"); // TODO: plans will be handled in /profile route?
              },
            },
            {
              text: t(`Proceed with the first ${user.plan.cigNumberAllowed} CIGs`),
              callback: () => {
                setNextIsEnabled(true);
                props.setJob({...props.job, transform: {...transform, planUpgradeDeclined: true}});
                //jobService.set(job);
                //onNext();
              },
              close: true,
            }
          ],
        );
      } else {
        setNextIsEnabled(true);
      }
    }
  }; //, [/*history, t, user.plan.name, user.plan.cigNumberAllowed, props.job, props.tabId*/]);

  useEffect(() => {
console.log("************* useEffect checkUserPlan");
    //if (props.active) {
console.log("************* useEffect checkUserPlan active");
      if (!props.job?.transform?.planUpgradeDeclined) {
console.log("************* useEffect checkUserPlan !planUpgradeDeclined");
        checkUserPlan();
      }
    //}
  }, [props, props.job?.transform?.planUpgradeDeclined/*, checkUserPlan*/]);

  useEffect(() => {
    //if (props.active) {
      if (props.job.file && !props.job.transform) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.transformXls2Xml(props.job.file.path).then(
            result => {
              if (result instanceof Error) {
                //JobService.set({...job, transform: result});
                props.setJob({...props.job, transform: result});
                toast.error(errorMessage(result));
                return setStatusLocal({ error: errorMessage(result)});
              }
              props.setJob({...props.job, transform: result.data.result});
              // JobService.set({...job, transform: result.data.result});
              setStatusLocal({success: result.data});
              //setNextIsEnabled(true);
            },
          );
        })();
      }
    //}
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props, props.job/*, setJob*/]);

  useEffect(() => {
    //if (props.active) {
      if (props.job.file && props.job.transform && !props.job.validateXml) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.validateXml(props.job.transform).then(
            response => {
              if (response instanceof Error) {
                props.setJob({...props.job, validateXml: response});
                //JobService.set(job);
console.log("************* validateXml error:", response);
                toast.error(errorMessage(response));
                return setStatusLocal({ error: errorMessage(response)});
              }
console.log("************* validateXml success:", response.data.result);
              props.setJob({...props.job, validateXml: response.data.result});
              //JobService.set(job);
              setStatusLocal({success: response.data});
            },
            error => {
              //job.validateXml = error;
              props.setJob({...props.job, validateXml: error});
              //JobService.set(job);
console.log("************* validateXml error 2:", error);
            },
          );
        })();
      }
    //}
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props, /*job.transform, setJob*/]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  //if (!props.active) return null;
  
  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Check")}
        </TabTitle>
        <TabParagraph>
          <pre>
            SL: {JSON.stringify(statusLocal)}
             J: {JSON.stringify(props.job, null, 2)}
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
            {`${t("Back")}`}
          </TabPrevButton>
        </Grid>
        <Grid item xs={6}>
          <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
            {`${t("Continue")}`}
          </TabNextButton>
        </Grid>
      </Grid>

      <Dialog
        dialogOpen={dialogOpen}
        dialogSetOpen={setDialogOpen}
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        dialogButtons={dialogButtons}
      />

    </TabContainer>
  );
}
Tab05Check.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab05Check.defaultProps = {
};

export default React.memo(Tab05Check);