import api from "./API";
//import TokenService from "./TokenService";

// // get job status
// const get = async () => {
//   // const user = TokenService.getUser();
//   // if (!user) {
//   //   return null;
//   // }
//   // return api.get("/job/get"/*, {
//   //   userId: user._id,
//   // }*/);

// const retval = await api.get("/job/get");
//   return api.get("/job/get");
// };

// // set job status
// const set = (job) => {
//   const user = TokenService.getUser();
//   if (!user) {
//     return null;
//   }
//   return api.put("/job/set", {
//     userId: user._id,
//     job
//   });
// };

// upload a file
const upload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return api.post("/job/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
};

// transform XLS to XML
const transformXls2Xml = (filePath) => {
  return api.post("/job/transformXls2Xml/:filePath", {
    filePath,
  });
}

// validate XML syntax
const validateXml = (transform) => {
  return api.post("/job/validateXml/:transform", {
    transform,
  });
}

// check ANAC periodic verification outcome
const outcomeCheck = (anno, codiceFiscaleAmministrazione) => {
  return api.post("/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione",
    {
      anno,
      codiceFiscaleAmministrazione,
    }
  );
}

// get ANAC periodic verification failed outcome details
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
  // get,
  // set,
  upload,
  transformXls2Xml,
  validateXml,
  outcomeCheck,
  outcomeFailureDetails,
};

export default JobService;
