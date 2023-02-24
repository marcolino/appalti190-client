import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { StatusContext } from "../providers/StatusProvider";
import config from "../config";
import { red } from '@mui/material/colors';

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
	notifications: {
    maxWidth: 300,
    fontSize: "1.5em",
	},
  media: {
    maxHeight: 300,
  },
}));

export default function Notifications(props) {
  const { status, setStatus } = useContext(StatusContext);
  const history = useHistory();
	const classes = useStyles();
  const { t } = useTranslation();

  const shareMessage = (index) => { // NEWFEATURE: handle message sharing, if needed
    alert(t("Sorry, message sharing is not handled, yet..."));
  };

  const deleteForeverMessage = (index) => {
    setStatus({pushNotifications: status.pushNotifications.filter((notification, i) =>
      i !== index
    )});
    if (status.pushNotifications.length <= 1) { // setStatus is asynchronous...
      history.goBack();
    }
  };
  
  //console.log("Notifications - status.pushNotifications:", status.pushNotifications);
  //console.log("Notifications - props.location.state:", props.location.state);

//{props.location.state && props.location.state.map((state, index) => {

  return (
    <div className={classes.root}>
      {status.pushNotifications.map((state, index) => {
        //console.log("Notifications state:", state);
        const timestamp = state.data["google.c.a.ts"];
        const when = new Intl.DateTimeFormat(
          config.languages.default, // TODO: use current language
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            //second: '2-digit',
          }
        ).format(timestamp * 1000); // milliseconds required
        return (
          <Card key={index} className={classes.root}>

            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red }} src={state.notification.image} aria-label="notification avatar" />
              }
              action={
                <IconButton aria-label="settings" size="large">
                  <MoreVertIcon />
                </IconButton>
              }
              title={state.notification.title}
              subheader={when}
            />

            <CardContent>
              <img src={state.notification.image} alt="test" style={{maxHeight: 300, maxWidth: 300}} />
            </CardContent>

            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {state.notification.body}
              </Typography>
            </CardContent>

            <CardActions>
              <IconButton aria-label="share" size="large">
                <ShareIcon  onClick={() => shareMessage(index)}/>
              </IconButton>
              <IconButton
                aria-label="delete forever"
                onClick={() => deleteForeverMessage(index)}
                size="large">
                <DeleteForeverIcon />
              </IconButton>
            </CardActions>

          </Card>
        );
      })}
    </div>
  );
}
