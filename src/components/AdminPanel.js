import React, { useState, useEffect/*, useContext*/ } from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";
import { errorMessage } from "../libs/Misc";
import UserService from "../services/UserService";
//import AuthService from "../services/AuthService";
//import Dialog from "./Dialog";
import { toast } from "./Toast";
//import moment from "moment";
//import "moment/locale/it"; // import all needed locales...

const useStyles = makeStyles(theme => ({
	adminPanel: {
    fontSize: "1.1em",
	},
}));



function AdminPanel() {
	const classes = useStyles();
  const { t } = useTranslation();
  const [content, setContent] = useState({});

  //moment.locale("it");

  useEffect(() => {
    UserService.getAdminPanel().then(
      result => {
        if (result instanceof Error) {
          toast.error(errorMessage(result));
          return; // setContent(errorMessage(result));
        }
        setContent(result);
      },
    );
  }, []);

  return (
    <div className={classes.adminPanel}>
      {`${t("Admin Panel")}`}
      <div>
        <label>{t("Users:")}</label>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <pre>
            {
              JSON.stringify(content, null, 2)
            }
          </pre>
          {/* {
            data.users ? data.users.map(user => (
              <Grid item xs={12} key={user._id}>
                <Card>
                  <CardContent style={{ fontSize: "0.9em" }}>
                    <Typography color="text.primary">
                      {`${user.firstName} ${user.lastName}`}
                    </Typography>
                    <Typography color="text.secondary">
                      {user.email}
                    </Typography>
                    <Typography color="text.secondary">
                      {t("Roles") + ":"} {user.roles.length ? user.roles.join(", ") : "user"}{// "user" is default role}
                    </Typography>
                    <Typography color="text.secondary">
                      {t("Verified") + ":"} {user.isVerified ? t("yes") : t("no")}
                    </Typography>
                    <Typography color="text.secondary">
                      {t("Created on") + ":"} {moment(user.createdAt).locale("it").format("YYYY-MM-DD")}
                    </Typography>
                    <Typography color="text.secondary">
                      {t("Updated on") + ":"} {moment(user.updatedAt).locale("it").format("YYYY-MM-DD")}
                    </Typography>
                    <Typography color="text.secondary">
                      {t("Access token") + ":"} {user.accessToken}
                    </Typography>
                    <Typography color="text.secondary">
                      {"Content:"} {content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )) : "..."
          } */}
        </Grid>
      </div>
    </div>
  );
}

export default React.memo(AdminPanel);