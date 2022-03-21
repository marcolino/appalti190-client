import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// get token from localStorage
function getLocalToken() {
  //console.log("$$$$$$$$$$$$ getLocalToken", window.localStorage.getItem("token"));
  //return window.localStorage.getItem("token");
  console.log("COOKIE getLocalToken", cookies.get("auth")?.user?.accessToken);
  return cookies.get("auth")?.user?.accessToken?.replace(/\./g, " ");
}

function refreshToken() {
//console.log("$$$$$$$$$$$$ refreshToken");
console.log("COOKIE refreshToken");
  // instance is the axios instance created in current request
  return instance.post("/refreshtoken")
    .then(res => res.data)
    .catch(err => console.error("Error refreshing token:", err)) // TODO...
  ;
}

// create an axios instance
const instance = axios.create({ // TODO: put these values in config...
  baseURL: "/api", // TODO: add version number (v1 ...)
  timeout: 10 * 1000,
  headers: {
    "Content-Type": "application/json",
    "X-Token": getLocalToken(), // headers set token
    "X-Auth-Token": getLocalToken(), // headers set token
    "authorization": getLocalToken(),
    //"Authorization": "Bearer " + getLocalToken(),
  }
})

// add a setToken method to the instance to dynamically add the latest token to the header after login, and save the token in the localStorage
instance.setToken = (token) => {
//console.log("$$$$$$$$$$$$ setToken", token);
console.log("COOKIE setToken:", token);
  instance.defaults.headers["X-Token"] = token;
  instance.defaults.headers["X-Auth-Token"] = token;
  instance.defaults.headers["authorization"] = token;
  //instance.defaults.headers["Authorization"] = "Bearer " + token;
//window.localStorage.setItem("token", token);
  cookies.set("auth", token);
console.log("COOKIE setToken read back:", cookies.get("auth"));
}

let isRefreshing = false; // is the token being refreshed?
let requests = []; // retry queue, each item will be a function to be executed

instance.interceptors.request.use(config => {
  //const token = window.localStorage.token;
  //const token = cookies.get("auth");
  const token = getLocalToken();
console.log("COOKIE instance.interceptors.request.use token:", token);
  if (token) {
    console.log("COOKIE instance.interceptors.request.use token IS SET");
    config.headers["X-Token"] = token;
    config.headers["X-Auth-Token"] = token;
    config.headers["authorization"] = token;
    //config.headers["Authorization"] = "Bearer " + token;
  }
else console.log("COOKIE instance.interceptors.request.use token IS NOT SET");
  return config;
}, error => {
  console.error("COOKIE instance.interceptors.request.use error:", error)
  return Promise.reject(error);
});


instance.interceptors.response.use(response => {
  // //document.body.classList.remove("loader"); // hide global loading indicator
  // var elems = document.querySelectorAll(".MuiContainer-root");
  // [].forEach.call(elems, function(el) {
  //     el.classList.remove("loader");
  // });

  const { reason } = response.data;
console.log("COOKIE instance.interceptors.response.use response:", response);
  if (reason === "expired token") {
    const config = response.config;
    if (!isRefreshing) { // token is not being refreshed
console.log("COOKIE instance.interceptors.response.use NOT isRefreshing");
      isRefreshing = true;
      return refreshToken().then(res => {
        const { token } = res.data;
console.log("COOKIE instance.interceptors.response.use refreshToken res:", res);
        instance.setToken(token);
        config.headers["X-Token"] = token;
        config.headers["X-Auth-Token"] = token;
        config.headers["authorization"] = token;
        //config.headers["Authorization"] = "Bearer " + token;
console.log("COOKIE instance.interceptors.response.use config.headers[X-Token]:", config.headers["X-Token"]);
        config.baseURL = "";
        // token has been refreshed to retry requests from all queues
        requests.forEach(cb => cb(token));
        requests = [];
        return instance(config);
      }).catch(err => { // TODO...
        console.error("refreshtoken error:", err);
        window.location.href = "/";
      }).finally(() => {
        isRefreshing = false;
      });
    } else { // token is being refreshed: we return a promise that resolve has not been executed
console.log("COOKIE instance.interceptors.response.use YES isRefreshing");
      return new Promise((resolve) => {
        // put resolve in the queue, save it in a function form, and execute it directly after token refreshes
        requests.push((token) => {
          config.baseURL = "";
          config.headers["X-Token"] = token;
          config.headers["X-Auth-Token"] = token;
          config.headers["authorization"] = token;
          //config.headers["Authorization"] = "Bearer " + token;
          resolve(instance(config));
        })
      })
    }
  }
console.log("COOKIE instance.interceptors.response.use returning", response);
  return response;
}, error => {
  console.error("COOKIE instance.interceptors.response.use rejecting:", error);
  return Promise.reject(error);
});

export default instance;
