import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useModal } from "mui-modal-provider";
import AuthService from "../services/AuthService";
import JobService from "../services/JobService";
import TokenService from "../services/TokenService";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";
import { errorMessage } from "../libs/Misc";
import { toast } from "./Toast";
import DragNDrop from "./DragNDrop";
import FlexibleDialog from "./FlexibleDialog";



function Tab04Upload(props) {
  //const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const [ prevIsEnabled ] = useState(true);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(!!props?.job?.file);
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);

  const [ accept ] = useState([
    ".csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ]);

  useEffect(() => {
    // check if user is authenticated
    const user = AuthService.getCurrentUser();
    if (!user) { // user is not authenticated
      openDialog({
        title: t("Please log in or register"),
        contentText: t("You need to be authenticated to proceed"),
        actions: [
          {
            text: t("Login"),
            closeModal: true,
            autoFocus: true,
            callback: () => {
              TokenService.set("redirect", props.tabId);
              history.push("/signin");
            },
          },
          {
            text: t("Register"),
            closeModal: true,
            callback: () => {
              TokenService.set("redirect", props.tabId);
              history.push("/signup");
            },
          },
          {
            text: t("Cancel"),
            closeModal: true,
            callback: () => props.goto("prev"),
          }
        ],
      });
      return false;
    }
    return true;
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [props]);

  const fileSet = useCallback(async(file) => {
    props.setJob({...props.job, file});
  }, [props]);

  const fileReset = useCallback(async() => {
    /**
     * When file is reset, we clear the full job! (we only keep tabId)
     */
    let job = {};
    job.tabId = props.job.tabId;
    //job.file = null;
    props.setJob(job);
    setNextIsEnabled(false);
  }, [props]);

  const fileValidate = useCallback((file) => { // validate file type or name
    // ods: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    // xls: application/vnd.ms-excel
    if (!( // TODO: check if these tests are sufficiently general...
      file?.type?.split("/")[1]?.match("officedocument.spreadsheetml.sheet") || //* TODO: ignore case... */
      file?.type?.split("/")[1]?.match("ms-excel")
    )) {
      return t(`Please upload a spreadsheet`) + `.` +
        (file?.type ? ` ` + t(`Selected file looks like {{fileType}}`, {fileType: file.type}) : ``)
      ;
    }
    return null; // validated
  }, [t]);

  const fileUpload = useCallback(async(file) => {
    await JobService.upload(file).then(
      result => {
        console.log('Upload success, file path', result.data.file);
        fileSet(result.data.file);
        //props.setJob({...props.job, file: result.data.file});
        // TODO: possibly save current job as historycal record
      },
      error => {
        console.error('Upload error:', error);
        fileReset();
        props.setJob({...props.job, file: {error: errorMessage(error)}}) // set upload error in job.file.error
        toast.error(errorMessage(error));
        return;
      }
    );
  }, [props, fileSet, fileReset]);

  const fileSelect = useCallback(async(selectedFile) => {
    if (selectedFile) {
      const error = fileValidate(selectedFile);
      if (error) {
        //setFile(null);
        props.setJob({...props.job, file: null});
        //fileSet(null);
        setNextIsEnabled(false);
      } else {
        //setFile(selectedFile);
        //fileSet(selectedFile);
        props.setJob({...props.job, file: selectedFile});
        await fileUpload(selectedFile);
        setNextIsEnabled(true);
      }
    } else {
      toast.error(t("No file selected, sorry... Please, repeat..."));
      //setFile(null);
      //fileSet(null);
      props.setJob({...props.job, file: null});
      setNextIsEnabled(false);
    }
  }, [/*fileSet, */props, fileUpload, fileValidate, t]);

  // on drop callback
  const onDrop = useCallback(acceptedFiles => {
    // this callback will be called after files get dropped, we will get the acceptedFiles;
    // if needed, we can even access the rejected files too
    console.log("accepted files:", acceptedFiles);
    fileSelect(acceptedFiles[0]);
  }, [fileSelect]);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = async () => {
    props.goto("next");
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Upload")}
        </TabTitle>
        <TabParagraph>
          Carica il foglio Excel compilato:
        </TabParagraph>

        <div className="container">
          <DragNDrop
            onDrop={onDrop}
            accept={accept}
          />
          <br />
          <TabParagraph>
            {props?.job?.file?.originalname && t("Selected file") + `: ${props?.job?.file?.originalname}`}
            <br />
            {props?.job?.file?.originalname && <Button
              variant="contained"
              size="small"
              onClick={fileReset}
              title={t("Remove file")}> 🗑 </Button>}
          </TabParagraph>
        </div>

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

    </TabContainer>
  );
}

Tab04Upload.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab04Upload.defaultProps = {
};

export default React.memo(Tab04Upload);