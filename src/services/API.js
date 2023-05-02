// TODO: move to ../middleware/ ....

import axios from "axios";
import TokenService from "./TokenService";
import EventBus from "../libs/EventBus";
import { i18n } from "../i18n";
import config from "../config";

const instance = axios.create({
  baseURL: config.api.endpoint,
  headers: config.api.headers,
  // {
  //   "Content-Type": "application/json",
  // },
});

instance.interceptors.request.use(
  (cfg) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      switch (config.api.backendType) {
        case "NodeJsExpress": // Node.js Express back-end
          cfg.headers["x-access-token"] = token;
          break;
        case "SpringBoot": // Spring Boot back-end
          cfg.headers["Authorization"] = `Bearer ${token}`;
          break;
        default:
          console.error(`Backend type unforeseen: ${config.backendType}, using 'NodeJsExpress'`);
          cfg.headers["x-access-token"] = token;
          break;
      }
    }

    // add user language to request
    //cfg.headers["x-user-language"] = i18n.language;
    cfg.headers["accept-language"] = i18n.language;
console.log("ACCEPT-LANGUAGE:", cfg.headers["accept-language"]);

    // add accepted version to request
    cfg.headers["accept-version"] = config.api.version;

    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  // (res) => {
  //   return res;
  // },
  (res) => {
    // if (res) console.log("RES:", Object.keys(res));
    // if (res) console.log("RES.REQUEST:", Object.keys(res.request));
    // console.log("RES.CONFIG:", Object.keys(res?.config));
    // console.log("RES.CONFIG.DATA:", Object.keys(res?.config?.data));
    return res;
  }, // res,
  async (err) => {
    const originalConfig = err.config;

    if ((originalConfig.url !== "/auth/signin" && originalConfig.url !== "/auth/signup") && err.response) {
console.log("******************* 1, originalConfig.url:", originalConfig.url, err.response);
      // a not-signin url, and got error response
      if (err.response.status === 401 && !originalConfig._retry) {
        // we got unauthorized error, and we did not retry yet
        // assuming Access Token was expired
        originalConfig._retry = true;

        // try to refresh token
console.log("XXX originalConfig.url:", originalConfig.url);
        try {
          const rs = await instance.post("/auth/refreshtoken", {
            refreshToken: TokenService.getLocalRefreshToken(),
          });

          const { accessToken } = rs.data;
          TokenService.updateLocalAccessToken(accessToken);

          return instance(originalConfig);
        } catch (error) { // could not refresh token
          EventBus.dispatch("logout");
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
