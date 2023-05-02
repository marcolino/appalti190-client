import api from "./API";
//import TokenService from "./TokenService";

/*
// get job status
const get = async () => {
  // const user = TokenService.getUser();
  // if (!user) {
  //   return null;
  // }
  return await api.get("/job/get");
};

// set job status
const set = (job) => {
  // const user = TokenService.getUser();
  // if (!user) {
  //   return null;
  // }
  return api.put("/job/set", {job});
};
*/

// upload a file
const upload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
console.info("*********** upload - file:", file, "formData:", formData);
  
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
  // const retval = api.post("/job/validateXml/:transform", {
  //   transform,
  // });
  // console.log("****************** validateXml retval:", retval);
  // return retval;
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

// // get ANAC periodic verification failed outcome details
// const outcomeFailureDetails = (anno, codiceFiscaleAmministrazione) => {
//   return api.post(
//     "/job/outcomeFailureDetails/anno/codiceFiscaleAmministrazione",
//     {
//       anno,
//       codiceFiscaleAmministrazione,
//     }
//   );
// }

// check url existence
const urlExistenceAndMatch = (url, fileToMatch) => {
console.log("*** jobService - url,fileToMatch:", url, fileToMatch);
  return api.post(
    "/job/urlExistenceAndMatch/url/fileToMatch",
    {
      url,
      fileToMatch,
    }
  );
}

// // just to ignore big xml when debug printing...
// const sanitizeJob = (job) => {
//   if (!job?.transform?.xml) {
//     return job;
//   }
//   let j = job;
//   j.transform.xml = "…";
//   return j;
// }

// const getAllPlans = () => {
//   return api.get(
//     "/job/getAllPlans",
//   );
// }

const JobService = {
//  get,
//  set,
  upload,
  transformXls2Xml,
  validateXml,
  outcomeCheck,
  //outcomeFailureDetails,
  urlExistenceAndMatch,
  //sanitizeJob,
  //getAllPlans,
};

export default JobService;
