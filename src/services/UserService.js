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

const getAllPlans = plans => {
  return api.get("/user/getAllPlans").then(
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

const getAllRoles = roles => {
  return api.get("/user/getAllRoles").then(
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

const getAllUsersWithFullInfo = () => {
  return api.get("/user/getAllUsersWithFullInfo"
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
  getAllPlans,
  updatePlan,
  getAllRoles,
  updateRoles,
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getAllUsersWithFullInfo,
};

export default UserService;
