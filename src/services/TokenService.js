const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.refreshToken;
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.accessToken;
};

const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const setUser = (user) => {
  //console.log("TokenService setUser:", JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const getJob = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  //console.log("TokenService getJob:", user.job);
  return user?.job ? user.job : {};
};

const setJob = (job) => {
  //console.log("TokenService setting job:", JobService.sanitizeJob(job));
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user.job = job;
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const removeJob = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    delete user.job;
    localStorage.setItem("job");
  }
};

// const getRedirect = () => {
//   return JSON.parse(localStorage.getItem("redirect"));
// };

// const setRedirect = (redirect) => {
//   localStorage.setItem("redirect", JSON.stringify(redirect));
// };

// const removeRedirect = () => {
//   localStorage.removeItem("redirect");
// };

const get = (key) => {
  if (key) return JSON.parse(localStorage.getItem(key));
};

const set = (key, value) => {
  if (key && value) localStorage.setItem(key, JSON.stringify(value));
};

const remove = (key) => {
  if (key) localStorage.removeItem(key);
};

const TokenService = {
  get,
  set,
  remove,
  getUser,
  setUser,
  removeUser,
  getJob,
  setJob,
  removeJob,
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
};

export default TokenService;
