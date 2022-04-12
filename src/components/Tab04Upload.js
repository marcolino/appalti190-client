import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import useDragAndDrop from "../hooks/useDragAndDrop";
import AuthService from "../services/AuthService";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
import { errorMessage } from "../libs/Misc";
import { toast } from "./Toast";
import Dialog from "./Dialog";
import { JobContext } from "../providers/JobProvider";
import JobService from "../services/JobService";



const useStyles = makeStyles(theme => ({
  fileDropLabel: {
    display: "inline-block",
    textAlign: "center",
    width: "100%",
    border: "3px black dashed",
    padding: "3em 1.78em", /* ??? */
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
  },
  fileDropError: {
    display: "inline-block",
    fontSize: "1.0em",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "darkred",
    marginTop: "1em",
  }
}));

function Tab04Upload(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  /* eslint-disable no-unused-vars */
  const { job, setJob } = useContext(JobContext);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogButtons, setDialogButtons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ file, setFile ] = useState(null);

  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError,
  } = useDragAndDrop();

  const openDialog = (title, content, buttons) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogButtons(buttons);
    setDialogOpen(true);    
  }

  useEffect(() => {
    if (props.active) {
      const user = AuthService.getCurrentUser();
      if (!user) { // user is not authenticated
        openDialog(
          t("Please log in or register"),
          t("You need to be authenticated to proceed"),
          [
            {
              text: t("Login"),
              close: true,
              callback: () => {
                setJob({...job, redirect2Tab: props.tabId});
                history.push("/signin");
              },
            },
            {
              text: t("Register"),
              close: true,
              callback: () => history.push("/signup"),
            },
            {
              text: t("Cancel"),
              close: true,
            }
          ],
        );
        return;
      }
    }
  }, [props, job, setJob, history, t]);

  const onDrop = (e) => {
    e.preventDefault();
    const selectedFile = e?.dataTransfer?.files[0];
    fileSelect(selectedFile);
  };

  const onFileSelect = (e) => {
    e.preventDefault();
    const selectedFile = e?.target?.files[0];
    fileSelect(selectedFile);
  };

  const fileSelect = (selectedFile) => {
    setDragOver(false);
    if (selectedFile) {
      const error = fileValidate(selectedFile);
      if (error) {
        setFileDropError(error);
        setFile(null);
        setNextIsEnabled(false);
      } else {
        setFileDropError(null);
        setFile(selectedFile);
        setNextIsEnabled(true);
      }
    } else {
      setFileDropError(t("No file selected, sorry... Please, repeat..."));
      setFile(null);
      setNextIsEnabled(false);
    }
  };

  const fileValidate = (file) => { // validate file type or name
    // ods: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    // xls: application/vnd.ms-excel
    if (!( // TODO: check if these tests are sufficiently general...
      file?.type?.split("/")[1]?.match("officedocument.spreadsheetml.sheet") ||
      file?.type?.split("/")[1]?.match("ms-excel")
    )) {
    //console.log("FILE:", file);
      return t(`Please upload a spreadsheet`) + `.` + (file?.type ? ` ` + t(`Selected file looks like {{fileType}}`, {fileType: file.type}) : ``);
    }
    return null; // validated
  };

  const fileReset = (e) => {
    setFile(null);
    document.getElementById("file").value = "";
    setFileDropError("");
    setNextIsEnabled(false);
    setDragOver(false);
  };

  const fileUpload = async () => {
    await JobService.upload(file).then(
      result => {
        //console.log('Upload success, file path', result.data.file);
        setJob({file: result.data.file});
        //console.log("job:", job);
      },
      error => {
        console.error('Upload error:', error);
        setFileDropError(errorMessage(error)); // TODO: handle upload errors in a separate state variable
        toast.error(errorMessage(error));
        return;
      }
    );
  };

  const onNext = async () => {
    await fileUpload();
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
          <form>
            <label
              htmlFor="file"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              style={{ /* width: "100%", textAlign: "center",*/ backgroundColor: `${dragOver ? "#ffdd00" : ""}`}}
              className={classes.fileDropLabel}
            >
              <span style={{ color: `${dragOver ? "black" : "#444"}` }}>
                {t("Drop the file here or click to select from disk")}
              </span>
            </label>
            <input type="file" name="file" id="file" onChange={onFileSelect} style={{display: "none"}} />
          </form>
          {fileDropError && (
            <div className={classes.fileDropError}>{fileDropError}</div>
          )}
          <br />
          <TabParagraph>
            {file && t(`File caricato: ${file.name}`)}
            <br />
            {file && <Button variant="contained" size="small" color="default" onClick={fileReset} title={t("Remove file")}> 🗑 </Button>}
          </TabParagraph>
        </div>

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
Tab04Upload.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab04Upload.defaultProps = {
};

export default React.memo(Tab04Upload);