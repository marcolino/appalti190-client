//import { RepeatTwoTone } from "@material-ui/icons";
import api from "./API";
import TokenService from "./TokenService";

const signup = ({/*username, */email, password, firstName, lastName}) => {
  return api
    .post("/auth/signup", {
      //username,
      email,
      password,
      firstName,
      lastName,
    }).then(response => {
console.error("RESPONSE:", response);
      return response.data;
//     }).then(error => {
// console.error("ERROR:", error);
    })
  ;
};

const signupConfirm = ({email, code}) => {
  return api
    .post("/auth/signupConfirm", {
      email,
      code,
    }).then((response) => {
      return response.data;
    })
  ;
};

const signin = ({/*username,*/email, password}) => {
  return api
    .post("/auth/signin", {
      //username,
      email,
      password
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
      }
      return response.data;
    })
  ;
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  //return JSON.parse(localStorage.getItem("user"));
  return TokenService.getUser();
};

const forgotPassword = (params) => {
  console.log("API forgotPassword /auth/recover - params:", params);
  return api.post("/auth/recover", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
console.error("ERR:", err);
    return { ok: false, ...err.response.data };
  });
};
  
const forgotPasswordSubmit = (params) => {
console.log("API forgotPasswordSubmit /auth/reset - params:", params);
  return api.post("/auth/reset", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};
  
const resendResetPasswordCode = (params) => {
console.log("API resendResetPasswordCode /auth/resend - params:", params);
  return api.post("/auth/resend", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};
    
const AuthService = {
  signup,
  signupConfirm,
  signin,
  logout,
  getCurrentUser,
  forgotPassword,
  forgotPasswordSubmit,
  resendResetPasswordCode,
};

export default AuthService;
