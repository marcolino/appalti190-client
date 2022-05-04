//import { RepeatTwoTone } from "@material-ui/icons";
import api from "./API";
import { i18nLogout } from "../i18n";
import TokenService from "./TokenService";

const signup = ({/*username, */email, password, firstName, lastName, address}) => {
  return api.post("/auth/signup", {
    //username,
    email,
    password,
    firstName,
    lastName,
    address,
  }).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const signupConfirm = ({email, code}) => {
  return api.post("/auth/signupConfirm", {
    email,
    code,
  }).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const signin = ({/*username,*/email, password}) => {
  return api.post("/auth/signin", {
    //username,
    email,
    password
  })
  .then(
    response => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
      }
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const forgotPassword = ({email}) => {
  return api.post("/auth/resetPassword/:email", {
    email
  }).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error;
    }
  );
};
  
const resetPasswordConfirm = ({email, password, code}) => {
  return api.post("/auth/resetPasswordConfirm/:email/:password/:code", {
    email,
    password,
    code
  }).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};
  
const resendSignUpCode = ({email}) => {
  return api.post("/auth/resendSignUpCode", {
    email,
  })
  .then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const resendResetPasswordCode = ({email}) => {
  return api.post("/auth/resendResetPasswordCode", {
    email
  })
  .then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};
    
const logout = () => {
  TokenService.removeUser();
  i18nLogout();
};

const getCurrentUser = () => {
  return TokenService.getUser();
};

const AuthService = {
  signup,
  signupConfirm,
  signin,
  forgotPassword,
  resetPasswordConfirm,
  resendSignUpCode,
  resendResetPasswordCode,
  logout,
  getCurrentUser,
};

export default AuthService;
