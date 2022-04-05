//import { RepeatTwoTone } from "@material-ui/icons";
import api from "./API";
import TokenService from "./TokenService";

// TODO: handle errors (with catch?)

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

const forgotPassword = ({email}) => {
  console.log("API forgotPassword /auth/resetPassword - email:", email);
  return api.post("/auth/resetPassword/email", {
    email
  }).then(
    (response) => {
      return response.data;
    },
    (error) => {
console.error("FORGOTPASSWORDERROR:", error);
    return error;
  });
};
  
const resetPasswordConfirm = ({email, password, code}) => {
console.log("resetPasswordConfirm /auth/resetPasswordConfirm:", {email, password, code});
  return api.post("/auth/resetPasswordConfirm/email/password/code", {
    email,
    password,
    code
  }).then(
    response => {
      return response.data;
    },
    error => {
console.error("resetPassword error:", error);
      return error;
    }
  );
};
  
const resendSignUpCode = ({email}) => {
console.log("API resendSignUpCode /auth/resendSignUpCode - params:", email);
  return api
    .post("/auth/resendSignUpCode", {
      email,
    })
    .then(response => {
console.log("API resendSignUpCode SUCCESS", response);
      return response.data;
    }).catch(err => {
console.log("API resendSignUpCode Error", err);
      return err;
    })
  ;
};

const resendResetPasswordCode = (params) => {
  console.log("API resendResetPasswordCode /auth/resendResetPasswordCode - params:", params);
  return api.post("/auth/resendResetPasswordCode", params).then(response => {
    return response.data;
  }).catch(err => {
    return err;
  });
};
    
const AuthService = {
  signup,
  signupConfirm,
  signin,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPasswordConfirm,
  resendSignUpCode,
  resendResetPasswordCode,
};

export default AuthService;
