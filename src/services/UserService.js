import api from "./API";

const getProfile = () => {
  return api.get("/user/getProfile").then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const updateProfile = ({/*username, */email, password, firstName, lastName, address, fiscalCode, businessName}) => {
  return api.post("/user/updateProfile", {
    //username,
    email,
    password,
    firstName,
    lastName,
    address,
    fiscalCode,
    businessName,
  }).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const updateUserProperty = ({userId, propertyName, propertyValue}) => {
  return api.post("/user/updateUserProperty", {
    userId,
    propertyName,
    propertyValue,
  }).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const getPlans = plans => {
  return api.get("/user/getPlans").then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const updatePlan = plan => {
  console.log("updatePlan - plan:", plan);
  return api.post("/user/updatePlan",
    plan,
  ).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const getRoles = roles => {
  return api.get("/user/getRoles").then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const updateRoles = roles => {
  return api.post("/user/updateRoles",
    roles,
  ).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const getPublicContent = () => {
  return api.get("/test/all");
};

const getUserBoard = () => {
  return api.get("/test/user");
};

const getModeratorBoard = () => {
  return api.get("/test/mod");
};

const getAdminBoard = () => {
  return api.get("/test/admin");
};

const getAdminPanel = () => {
  return api.get("/admin/getAdminPanel"
  ).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error;
    }
  );
};

const UserService = {
  getProfile,
  updateProfile,
  updateUserProperty,
  getPlans,
  updatePlan,
  getRoles,
  updateRoles,
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getAdminPanel,
};

export default UserService;
