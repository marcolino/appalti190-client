import api from "./API";

const upload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return api.post("/job/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
};

const transformXls2Xml = (filePath) => {
  return api.post("/job/transformXls2Xml/:filePath", {
    filePath,
  });
}

const validateXml = (transform) => {
  return api.post("/job/validateXml/:transform", {
    transform,
  });
}

const outcomeCheck = (anno, codiceFiscaleAmministrazione) => {
  return api.post("/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione",
    {
      anno,
      codiceFiscaleAmministrazione,
    }
  );
}

const outcomeFailureDetails = (anno, codiceFiscaleAmministrazione) => {
  return api.post(
    "/job/outcomeFailureDetails/anno/codiceFiscaleAmministrazione",
    {
      anno,
      codiceFiscaleAmministrazione,
    }
  );
}

const JobService = {
  upload,
  transformXls2Xml,
  validateXml,
  outcomeCheck,
  outcomeFailureDetails,
};

export default JobService;
