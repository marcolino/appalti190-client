import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "./Toast";
import { errorMessage } from "../libs/Misc";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
import { JobContext } from "../providers/JobProvider";
import AuthService from "../services/AuthService";
import JobService from "../services/JobService";
import Dialog from "./Dialog";

function Tab05Check(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { job, setJob } = useContext(JobContext);
  const [ statusLocal, setStatusLocal ] = useState({});
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogButtons, setDialogButtons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (title, content, buttons) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogButtons(buttons);
    setDialogOpen(true);    
  }

  useEffect(() => {
    if (props.active) {
      if (job.file && !job.transform) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.transformXls2Xml(job.file.path).then(
            result => {
              if (result instanceof Error) {
                setJob({...job, transform: result});
                toast.error(errorMessage(result));
                return setStatusLocal({ error: errorMessage(result)});
              }
              setJob({...job, transform: result.data.result});
              setStatusLocal({success: result.data});
              //setNextIsEnabled(true);
            },
          );
        })();
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props, job/*, setJob*/]);

  useEffect(() => {
    checkUserPlan();
  }, [job.transform]);

  useEffect(() => {
    if (props.active) {
      if (job.file && job.transform && !job.validateXml) {
        (async () => {
          setStatusLocal({loading: true});
          await JobService.validateXml(job.transform).then(
            response => {
              if (response instanceof Error) {
                setJob({...job, validateXml: response});
                toast.error(errorMessage(response));
                return setStatusLocal({ error: errorMessage(response)});
              }
              setJob({...job, validateXml: response.data.result});
              setStatusLocal({success: response.data});
            },
          );
        })();
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props, job/*, setJob*/]);

  const onNext = () => {
    props.goto("next");
  };

  const checkUserPlan = async() => {
    if (job.transform) {
      const user = AuthService.getCurrentUser();
      console.log("PLAN:", user.plan.cigNumberAllowed, job.transform.cigCount);
      if (
        (user.plan.cigNumberAllowed === "unlimited") ||
        (parseInt(user.plan.cigNumberAllowed) < job.transform.cigCount)
      ) {
        const planRequired = {}; // TODO: ask server for plans...
        planRequired.name = "Better";
        openDialog(
          t("Please upgrade your plan"),
          t("You need to upgrade your plan to proceed.") + "\n" +
          t(`Your current plan is "${user.plan.name}".`) + "\n" +
          t(`To elaborate ${job.transform.cigCount} CIGs you need at least plan "${planRequired.name}"`),
          [
            {
              text: t("Upgrade plan"),
              close: true,
              callback: () => {
                setJob({...job, redirect2Tab: props.tabId});
                history.push("/profile"); // TODO: plans will be handled in /profile route?
              },
            },
            {
              text: t("Cancel"),
              close: true,
            }
          ],
        );
      } else {
        setNextIsEnabled(true);
      }
    }
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Check")}
        </TabTitle>
        <TabParagraph>
         {/* SL:  {JSON.stringify(status.job?.transform)} */}
          {statusLocal && "loading" in statusLocal && `Elaborazione in corso...`}
          {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
          {statusLocal && "success" in statusLocal && `Elaborazione completata`}
        </TabParagraph>
        {statusLocal && "error" in statusLocal && `Errore: ${statusLocal.error}`}
        {((statusLocal && "success" in statusLocal) || (statusLocal && "error" in statusLocal)) && (
          <pre>
            {
              JSON.stringify(job, null, 2)
            }
          </pre>
        )}
      </TabBodyScrollable>

      <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
        {`${t("Continue")}`}
      </TabNextButton>

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