import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import TokenService from "../services/TokenService";
import JobService from "../services/JobService";
import Dialog from "./Dialog";



function Tab05Check(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const user = TokenService.getUser();
  //const { job, setJob } = useContext(JobContext);
  //const job = JobService.get();
  //const [ job, setJob ] = useState(TokenService.getJob());
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(!!props?.job?.transform?.planUpgradeDeclined);
  const [ prevIsEnabled] = useState(true);
  const [ dialogTitle, setDialogTitle ] = useState(null);
  const [ dialogContent, setDialogContent ] = useState(null);
  const [ dialogButtons, setDialogButtons ] = useState([]);
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const configDialog = (title, content, buttons) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogButtons(buttons);
    //setDialogOpen(true);
  }

  // check user plan
  useEffect(() => {
    configDialog(
      t("Please upgrade your plan"),
      t("You need to upgrade your plan to proceed.") + "\n" +
      t(`Your current plan is "${user?.plan?.name}".`) + "\n" +
      t(`To elaborate ${props.job?.transform?.cigCount} CIGs you need at least plan "${props.job?.transform?.planRequired?.name}"`),
      [
        {
          text: t("Upgrade plan"),
          close: true,
          callback: () => {
            //TokenService.setRedirect(props.tabId);
            TokenService.set("redirect", props.tabId);
            history.push("/profile"); // redirect to /profile route, where plan can be changed
          },
        },
        {
          text: t(`Proceed with the first ${user?.plan?.cigNumberAllowed} CIGs`),
          callback: () => {
            setNextIsEnabled(true);
            props.setJob({...props.job, transform: {...props.job?.transform, planUpgradeDeclined: true}});
          },
          close: true,
        }
      ],
    );
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [history, props, t/*, user?.plan*/]);

  useEffect(() => {
    if (props.job?.transform) {
      if (props.job?.transform?.code === "TRUNCATED_DUE_TO_PLAN_LIMIT") {
        if (!props.job?.transform?.planUpgradeDeclined) { // TODO: when will we reset this flas?
          return setDialogOpen(true);
        }
      }
    } else {
      setNextIsEnabled(true);
    }
  }, [props.job?.transform]);

  useEffect(() => {
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
  }, [props, props.job]);

  useEffect(() => {
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