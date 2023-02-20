import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 10,
  borderColor: "#64a36f",
  borderStyle: "dashed",
  backgroundColor: "#cef0b9",
  color: "#353535",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  backgroundColor: "#d3f6d1",
  borderColor: "#a7d7c5",
};

const acceptStyle = {
  backgroundColor: "lightgreen",
  borderColor: "darkgreen",
};

const rejectStyle = {
  backgroundColor: "lightred",
  borderColor: "darkred",
};

const disabledStyle = {
  backgroundColor: "lightgray",
  borderColor: "darkgray",
  fontStyle: "italic",
};

const DragNDrop = ({ drop, accept, disabled }) => {
  const { t } = useTranslation();
  const {
    getRootProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive
  } = useDropzone({
    onDrop: drop,
    accept: accept,
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(disabled ? disabledStyle : isFocused ? focusedStyle : {}),
    ...(disabled ? disabledStyle : isDragAccept ? acceptStyle : {}),
    ...(disabled ? disabledStyle : isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject,
    disabled,
  ]);

  const {onClick, onBlur, onDragEnter, onDragLeave, onDragOver, onDrop, onFocus, onKeyDown, ...getRootPropsDisabled} = getRootProps({style});
  let getRootPropsActual = {};
  if (disabled) {
    getRootPropsActual = getRootPropsDisabled;
  } else {
    getRootPropsActual = getRootProps({style});
  } 

  return (
    <div className="dropzone-div" {...getRootPropsActual}>
      <div className="text-center">
        {
          disabled ? (
            <p>
              {t("Remove file to load a new one")}
            </p>
          ) :
          isDragActive ? (
            <p className="dropzone-content">
              {t("Release to drop the files here")}
            </p>
          ) : (
            <p className="dropzone-content">
              {t("Drag 'n drop some files here, or click to select files")}
            </p>
          )
        }
      </div>
    </div>
  );
};

DragNDrop.propTypes = {
  drop: PropTypes.func.isRequired,
  accept: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
};
DragNDrop.defaultProps = {
  disabled: false,
};

export default DragNDrop;
