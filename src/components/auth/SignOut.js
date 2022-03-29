import React from "react";
import { useEffect/*, useContext*/ } from "react";
import { useHistory } from "react-router-dom";
//import { useTranslation } from "react-i18next";
//import { signOut } from "../../libs/TrackPromise";
import AuthService from "../../services/AuthService";
import EventBus from "../../libs/EventBus";
//import { AuthContext } from "../../providers/AuthProvider";
//import { OnlineStatusContext } from "../../providers/OnlineStatusProvider";
//import { toast } from "../Toast";



function SignOut() {
//  const history = useHistory();
//  const isOnline = useContext(OnlineStatusContext);
//  const { auth, setAuth } = useContext(AuthContext);
//  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (AuthService.getCurrentUser()) { // TODO: do we need this?
      AuthService.logout();
      history.push("/");
      //window.location.reload();
      EventBus.dispatch("logout");
    }
  }, [history]);

  // // handle auth
  // useEffect(() => {
  //   EventBus.on("logout", () => {
  //     logOut();
  //   });

  //   logOut();

  //   return () => {
  //     EventBus.remove("logout");
  //   };
  // }, []);

  // const logOut = () => {
  //   console.log("LOGOUT");
  //   AuthService.logout();
  //   //window.location.reload();
  // };

/*
  useEffect(() => {
    if (!isOnline) { // fake signout while offline...
      //return toast.warning("You are currently offline. Please wait for the network to become available.");
console.log("signOut calling setAuth");
      setAuth({ user: false });
      history.replace("/");
    } else {
      signOut({
        success: () => {
          //toast.success(t("Signed out")); // too noisy...
console.log("signOut calling setAuth");
console.log("SETAUTH auth:", auth);
          setAuth({ user: false })
console.log("SETAUTH auth:", auth);
          history.replace("/");
        },
        error: (err) => {
console.error("signOut error:", err);
          toast.error(t(err.message));
        }
      });
    }
  }, [isOnline, history, auth, setAuth, t]);
*/

  return null;
};

export default React.memo(SignOut);
