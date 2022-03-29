import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
//import { useDrpzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
//import Paper from "@material-ui/core/Paper";
//import RootRef from "@material-ui/core/RootRef";
import useDragAndDrop from "../hooks/useDragAndDrop";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton } from "./TabsComponents";
//import { ControlPointDuplicateOutlined } from "@material-ui/icons";
import { ServiceContext } from "../providers/ServiceProvider";
//import { AuthContext } from "../providers/AuthProvider"; // TODO: test only
//import { upload } from "../libs/Fetch"; // TODO (use instance.post in libs/Fetch, not a raw fetch ...)
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
  //const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const { service, setService } = useContext(ServiceContext);
  //const { auth, setAuth } = useContext(AuthContext);
  const [ nextIsEnabled, setNextIsEnabled ] = useState(false);
  const [ file, setFile ] = useState(null);
  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError,
  } = useDragAndDrop();

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
    if (!( // TODO: check if these tests are enough general...
      file?.type?.split("/")[1]?.match("officedocument.spreadsheetml.sheet") ||
      file?.type?.split("/")[1]?.match("ms-excel")
    )) {
console.log("FILE:", file);
console.log("FILE.TYPE:", file?.type);
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
      (response) => {
        console.log('Upload success, file path', response.data.file);
        setService({file: response.data.file});
        console.log("service:", service);
      },
      (error) => { // TODO...
        console.error('Upload error:', error);
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
    </TabContainer>
  );
}
Tab04Upload.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab04Upload.defaultProps = {
};

export default React.memo(Tab04Upload);