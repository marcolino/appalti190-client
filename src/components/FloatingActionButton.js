import React, { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Container, Button, lightColors, darkColors } from "react-floating-action-button";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
//import useSound from "use-sound";
import { StatusContext } from "../providers/StatusProvider";
//import config from "../config";
//import buttonClick from "../assets/sounds/pop.mp3";



function FloatingActionButton(props) {
  const { status } = useContext(StatusContext);
  const location = useLocation();
  const history = useHistory();
  //const { t } = useTranslation();
  //const [play] = useSound(/*config.sounds.*/buttonClick); 

  const showingNotifications = (location.pathname === "/notifications");
  const show = (status.pushNotifications.length && !showingNotifications);

  const link = props.link ? props.link : {
    pathname: "/notifications",
    //search: "?query=abc",
    state: status.pushNotifications,
  };

  const action = () => {
    history.push(link);
    //play();
  };

  return show ? (
    <Container>
      <Button
        //tooltip={t("You have some new notifications!")}
        rotate={true}
        onClick={action}
        styles={{backgroundColor: darkColors.lighterRed, color: lightColors.white}}
      >
        <NotificationsActiveIcon />
        <span style={{position: "relative", bottom: "-0.8em", fontSize: "90%", fontWeight: "bold"}}>
          {status.pushNotifications.length > 1 ? status.pushNotifications.length : null}
        </span>
      </Button>
    </Container>
  ) : null
}

export default React.memo(FloatingActionButton);
