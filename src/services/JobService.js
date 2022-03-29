import api from "./API";

const upload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return api.post(
    "/job/upload", 
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
  );
};

const transformXls2Xml = (filePath) => {
  return api.post(
    "/job/transformXls2Xml/filePath",
    {
      filePath,
    }
  );
}

const JobService = {
  upload,
  transformXls2Xml,
};

export default JobService;
