import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "blue",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#353535",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  backgroundColor: "lightyellow",
  borderColor: "purple",
};

const acceptStyle = {
  backgroundColor: "lightgreen",
  borderColor: "darkgreen",
};

const rejectStyle = {
  backgroundColor: "lightred",
  borderColor: "darkred",
};

const DragNDrop = ({ onDrop, accept }) => {
  const { t } = useTranslation();
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive
  } = useDropzone({
    onDrop,
    accept
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject,
  ]);

  return (
    <div className="dropzone-div" {...getRootProps({style})}>
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">
            {t("Release to drop the files here")}
          </p>
        ) : (
          <p className="dropzone-content">
            {t("Drag 'n drop some files here, or click to select files")}
          </p>
        )}
      </div>
    </div>
  );
};

export default DragNDrop;
