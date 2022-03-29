//import instance from "../middlewares/UNUSED-Interceptors";
import api from "../services/API";

export const signIn = (params) => {
  return api.post("/auth/login", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const getUsers = (params) => {
  return api.post("/user", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const forgotPassword = (params) => {
console.log("FETCH forgotPassword /auth/recover - params:", params);
  return api.post("/auth/recover", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
console.error("ERR:", err);
    return { ok: false, ...err.response.data };
  });
};

export const forgotPasswordSubmit = (params) => {
console.log("FETCH forgotPasswordSubmit /auth/reset - params:", params);
  return api.post("/auth/reset", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const resendResetPasswordCode = (params) => {
  return api.post("/auth/resend", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};


export const upload = (params) => {
  console.log("upload params:", params);
    return api.post("/service/upload").then(response => {
  console.log("upload response:", response);
      return { ok: true, ...response.data };
    }).catch(err => {
  console.warn("err.message", err.message, err.reason)
      return { ok: false, message: err.message };
    });
  };
  
// export const transformXls2Xml = (params) => { // TODO: we don't need params.file.path (???)
// console.log("transformXls2Xml params:", params);
//   return api.post("/service/transformXls2Xml/filePath", {filePath: params.file.path}).then(response => {
// console.log("transformXls2Xml response:", response);
//     return { ok: true, ...response.data };
//   }).catch(err => {
// console.warn("err.message", err.message, err.reason)
//     return { ok: false, message: err.message };
//   });
// };

// export const federatedSignIn = (params) => {
// console.log(currentFunctionName(), params);
//   //return fetcher("/api/auth/login", "POST", params);
//   //return instance.post("/auth/login", params);PromiseRejectionEvent
//   return instance.get("http://localhost:5000/api/auth/loginGoogle", params).then(response => {
//     console.log("response status:", response.status);
//     console.log("response data:", JSON.stringify(response.data));
//     return response.data;
//   }).catch(err => {
//     console.error(`Error fetching data: ${err}`, err); // TODO...
//     return err;
//   });
// };

// const Auth = {
//   signUp: (params) => {
//     //console.log(currentFunctionName(), params);
//     return fetcher("/api/auth/register", "POST", params);
//   },
//   confirmSignUp: (params) => {
//     //console.log(currentFunctionName(), params);
//     // TODO: props = props.filter(key => key === "code");
//     return fetcher(`/api/auth/verify/${params.code}`, "GET", params); // TODO: change the name: choose verify or confirmSignUp, and code or token (better code) ...
//   },
//   signIn: (params) => {
// console.log(currentFunctionName(), params);
//     //return fetcher("/api/auth/login", "POST", params);
//     return instance.post("/api/auth/login", params);
//   },
//   signOut: (params) => { // TODO: test me...
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   },
// };
//
// const fetcher = (url, method, params) => {
//     return new Promise((resolve, reject) => {
//       if (method === "GET" && params) {
//         url += "?" + Object.keys(params).map((key) => {
//           return encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
//         }).join("&");
//       }
//       fetch(url, {
//         method,
//         headers: new Headers(config.api.headers),
//         ...(params && method !== "GET" && { body: JSON.stringify(params) }),
//         redirect: config.api.redirect,
//       })
//         .then(res => {
//           try {
//             res.json().then(data => {
//               if (!res.ok) reject({status: res.status, statusText: res.statusText, message: data.message ? data.message : res.statusText})
//               resolve(data);
//             });
//           } catch (err) {
//             console.error(`fetch ${url} error:`, err); // TODO: !!!
//             reject(err);
//           }
//         })
//         .catch(err => {
//           console.error(`fetch ${url} error:`, err); // TODO: !!!
//           reject(err);
//         })
//       ;
//     });
//   }