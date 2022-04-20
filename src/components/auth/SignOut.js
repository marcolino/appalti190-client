import React from "react";
import { useEffect/*, useContext*/ } from "react";
import { useHistory } from "react-router-dom";
import AuthService from "../../services/AuthService";
//import TokenService from "../../services/TokenService";
import EventBus from "../../libs/EventBus";
//import { toast } from "../Toast";



function SignOut() {
  //const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    //if (AuthService.getCurrentUser()) { // we don't need this...
      AuthService.logout();
      //TokenService.removeRedirect();
      history.push("/");
      EventBus.dispatch("logout");
    //}
  }, [history]);

  return null; // returning null is required
};

export default React.memo(SignOut);
