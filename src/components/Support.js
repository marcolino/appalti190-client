import React from "react";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import emailScramble from "email-scramble";
import { Typography, Box, Link } from "@mui/material";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph } from "./TabsComponents";
import TokenService from "../services/TokenService";
import config from "../config";

const useStyles = makeStyles(theme => ({
  emailLabel: {
  },
  email: {
    fontWeight: "bold",
	},
  emailIcon: {
    color: "#d6302c",
    fontWeight: "bold",
    fontSize: "1.3em",
  },
  phone: {
    fontWeight: "bold",
	},
  phoneIcon: {
  },
  }));

function Support() {
  const classes = useStyles();
  // const { auth } = useContext(AuthContext);
  const user = TokenService.getUser();
  const { t } = useTranslation();

  console.log("USER:", user);

  return (
    <TabContainer>
      <TabBodyScrollable>
        <Box // TODO: make a reusable component of this box...
          sx={{
            mx: { xs: "5%", md: "20%" },
            mb: "1em",
            p: 1,
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "grey.800" : "grey.300",
            borderRadius: 2,
            fontSize: "1em",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <TabTitle>
            {t("Support")}
          </TabTitle>
        </Box>
        <Box
          sx={{
            mx: { xs: "5%", md: "20%" },
            mb: "1em",
            p: 4,
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "grey.800" : "grey.300",
            borderRadius: 2,
            fontSize: "1em",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          <TabParagraph>
            <Typography>
              {t("We offer a complete support service to all our users")}.
            </Typography>
            <br />
            <Typography>
              {t("To {{plan}} plan users we offer email support for basic technical questions and all administrative questions", {plan: t("free")})}.
            </Typography>
            <Typography>
              {t("Email answer will be responded to after at most {{count}} hours", {count: config.support.freePlan.emailMaximumAnswerHoursDelay})}.
            </Typography>
            <br />
            <Typography>
              {t("To {{plan}} plan users we offer email support for all technical questions and all administrative questions", {plan: t("classic")})}.
            </Typography>
            <Typography>
              {t("Email answer will be responded to after at most {{count}} hours", {count: config.support.classicPlan.emailMaximumAnswerHoursDelay})}.
            </Typography>
            <br />
            <Typography>
              {t("To {{plan}} users we offer email support for all kinds of questions, and direct line telephone support", {plan: t("unlimited")})}.
            </Typography>
            <Typography>
              {t("Email answer will be responded to after at most {{count}} hours", {count: config.support.unlimitedPlan.emailMaximumAnswerHoursDelay})}.
            </Typography>
            <br />
            <Typography>
              {t("Your current plan is")} <b>{user ? t(user?.plan?.name) : t("free")}</b>.
            </Typography>
            <br />
            <Typography>
              <span
                classname={classes.emailLabel}
              >
                <span className={classes.emailIcon}> @ </span> {t("Contact us by email")}:
              </span>
              &nbsp;
              <Link
                href={"mailto:" + emailScramble.decode(config.support.email)}
                className={classes.email}
              >
                <b>{emailScramble.decode(config.support.email)}</b>
              </Link>
            </Typography>
            {!user ? (
              <Typography>
                {t("Please login for phone support")}.
              </Typography>
            ) : (
              user?.plan?.name === "unlimited" ?
                <Typography>
                  <span
                    classname={classes.phoneLabel}
                  >
                    <span className={classes.phoneIcon}>☎️</span> {t("Contact us by phone")}:
                  </span>
                  &nbsp;
                  <Link
                    href={`tel: ${config.support.phone}`}
                    className={classes.phone}
                  >
                    {config.support.phone}
                  </Link>
                </Typography>
                :
                <Typography>
                  <span style={{color: "blue", fontSize: "0.8em"}}>☎️</span>&nbsp;&nbsp;{`${t("Please update your plan for phone support")}`}.
                </Typography>
            )}
          </TabParagraph>
        </Box>
      </TabBodyScrollable>
    </TabContainer>
  );
}

export default React.memo(Support);