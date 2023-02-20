import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { ToastContainer, toast } from "./components/Toast";
import { i18n } from "./i18n";

//console.log("app started rendering");
const root = document.getElementById("root");
ReactDOM.render(
  // <React.StrictMode>
  <>
    <App />
    <ToastContainer />
  </>,
  // </React.StrictMode>,
  root
);
/**
 * NOTE:
 * <React.StrictMode> with material-ui v4 causes JS error
 *   `findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference.`
 * To avoid it, avoid using <React.StrictMode> here, OR upgrade to material-ui v5
 */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// function sendToAnalytics(metric) {
//   const body = JSON.stringify({[metric.name]: metric.value});
//   (navigator.sendBeacon && navigator.sendBeacon("/analytics", body)) ||
//     fetch("/analytics", {body, method: "POST", keepalive: true});
// }
//reportWebVitals(sendToAnalytics);
//reportWebVitals(console.log);
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();

// Set up a broadcast channel to localize messages from i18n service worker
const channelI18nMessages = new BroadcastChannel("sw-i18n-messages");
channelI18nMessages.addEventListener("message", event => {
  toast[event.data.level](i18n.t(event.data.message));
});

// Set up a broadcast channel to localize messages from background push messages service worker
const channelBackgroundPushMessages = new BroadcastChannel("sw-background-push-messages");
channelBackgroundPushMessages.addEventListener("message", event => {
  toast[event.data.level](i18n.t(event.data.message));
});
