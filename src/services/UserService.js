import api from "./API";

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
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getAdminPanel,
};

export default UserService;
