import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useModal } from "mui-modal-provider";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Switch from "@mui/material/Switch";
//import PlanCardTestBackgroundImage from "../assets/images/PlanCardTestBackgroundImage.png";
import FlexibleDialog from "./FlexibleDialog";
import JobService from "../services/JobService";
import { capitalize, currencyISO4217ToSymbol } from "../libs/Misc";



const useStyles = makeStyles((theme) => ({
  section: {
  },
  cardHeader: {
    paddingTop: theme.spacing(3),
  },
  cardHeaderActive: {
    fontWeight: "bold",
  },
  cardHeaderTest: {
    paddingBottom: 0,
  },
  cardTest: { // a style similar to Stripe's test tag
    color: "#bb571f",
    backgroundColor: "#ffde92",
    borderRadius: 5,
    fontSize: 14,
    fontWeight: "bold",
    padding: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  // cardRibbonTest: {
  //   backgroundImage: `url(${PlanCardTestBackgroundImage})`,
  //   backgroundRepeat: "no-repeat",
  //   backgroundSize: "cover",
  // },
  card: {
    transition: "box-shadow .3s",
    borderRadius: 10,
    border: "1px solid #ccc",
    "&:hover": {
      boxShadow: "10px 10px 30px rgba(32, 32, 132, .5)",
    },
  },
  cardActive: {
    backgroundColor: "#ffffe0",
  },
  cardHr: {
    border: "1px solid #eee",
  },
}));



const Pricing = props => {
console.log("Pricing - props:", props);
  const classes = useStyles();
  const { t } = useTranslation();
  const { showModal } = useModal();
  const openDialog = (props) => showModal(FlexibleDialog, props);
  const [perMonth, setPerMonth] = React.useState(false);
  const [plans, setPlans] = useState([]);

  const handleChangePerMonth = (event) => {
    setPerMonth(event.target.checked);
  };

  // get user plans on load
  useEffect(() => {
    JobService.getPlans().then(
      result => {
        if (!!!!(result instanceof Error)) { // TODO: handle error...
          console.error("getPlans error:", result);
          return
        }
        console.log(`getPlans got successfully:`, result.data);
        setPlans(result.data);
      }
    );
  }, [setPlans]);

  const isActivePlan = (plan) => {
    return props.currentPlanName === plan.name;
  };

  return (
    <section className={classes.section}>
      <Container>
        <Box py={0} textAlign="center">
          <Box mb={0}>
            <Container maxWidth="sm">
              <Typography variant="h3" component="h2" gutterBottom={true}>
                <Typography variant="h6" component="span" color="primary">{t("Choose the plan which best suits your needs")}</Typography>
              </Typography>
              {(
                (typeof plans[0]?.pricePerMonth !== "undefined") &&
                (typeof plans[0]?.pricePerYear !== "undefined")
              ) && (
                <div>
                  <Typography variant="subtitle1" component="span">{t("per year")}</Typography>
                    <span>
                      &nbsp;
                      <Switch name="checkbox" color="primary" checked={perMonth} onChange={handleChangePerMonth} />
                      &nbsp;
                    </span>
                  <Typography variant="subtitle1" component="span">{t("per month")}</Typography>
                </div>
              )}
            </Container>
          </Box>
          <Grid container spacing={3}>
            {plans.map((plan, index) => (
              <Grid key={index} item xs={12} md={parseInt(plans.length ? 12 / plans.length : 12)}>
                <Card
                  variant="outlined"
                  className={[classes.card, isActivePlan(plan) ? classes.cardActive : null, /*props.paymentMode !== "live" ? classes.cardRibbonTest : null*/].join(" ")}
                >
                  <CardHeader
                    title={capitalize(t(plan.name))}
                    className={[classes.cardHeader, isActivePlan(plan) ? classes.cardHeaderActive : null].join(" ")}
                    titleTypographyProps={isActivePlan(plan) ? { fontWeight: "bold" } : {}}
                  >
                  </CardHeader>
                  {props.paymentMode !== "live" ? <span className={classes.cardTest}> TEST </span> : <></>}
                  <hr className={classes.cardHr} />
                  <CardContent>
                    <Box px={1}>
                      <Typography variant="h4" component="h2" gutterBottom={true} style={{fontWeight: "bold"}}>
                        {currencyISO4217ToSymbol(plan.priceCurrency)}
                        {perMonth ? plan.pricePerMonth : plan.pricePerYear}
                        {<Typography variant="h6" color="textSecondary" component="span"> / {perMonth ? t("month") : t("year")}</Typography>}
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="p">{
                        (plan.cigNumberAllowed ===  Number.MAX_SAFE_INTEGER) ?
                          t("Unlimited CIG's")
                        :
                          t("Up to {{cigs}} CIG's", {cigs: plan.cigNumberAllowed})
                      }</Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="div">{
                        plan.supportTypes.map((supportType, index) => (
                          <div key={index}>{t("Support") + " " + t("by") + " " + t(supportType)}</div>
                        ))
                      }</Typography>
                      <br />
                    </Box>
                    <Button variant="contained" color="secondary"
                      onClick={(e) => {
                        openDialog({
                          title: t("Sure to buy this plan?"),
                          contentText: t("(it's very expensive!)"),
                          actions: [
                            {
                              callback: () => {
                                console.log("Clicked first action button");
                                props.onPlanSelected(e, plan.name);
                              },
                              text: t("Ok"),
                              closeModal: true,
                              // autoFocus: true,
                            },
                            {
                              callback: () => {console.log("Clicked second action button")},
                              text: t("Cancel"),
                              closeModal: true,
                            }
                          ],
                        });
                      }}
                      disabled={isActivePlan(plan)}
                    >{
                      isActivePlan(plan) ?
                        t("Active plan")
                      :
                        t("Select plan")
                    }
                    </Button>
                    {props.canForcePlan && (
                      <>
                        <Box mt={1} />
                        <Button variant="contained" color="tertiary"
                          onClick={(e) => {
                            props.onPlanForced(e, plan.name);
                          }}
                          disabled={isActivePlan(plan)}
                        >{
                          t("Force plan")
                        }
                        </Button>
                      </>
                    )}
                    <Box mt={2}>
                      <Link href="#" color="primary">{/* TODO: create a link (or popup) to give more details about selecting this plan... */}
                        <small>{t("Learn more")}</small>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </section>
  );
}

Pricing.propTypes = {
  currentPlanName: PropTypes.string,
  onPlanSelected: PropTypes.func,
  canForcePlan: PropTypes.bool,
  onPlanForced: PropTypes.func,
};

Pricing.defaultProps = {
  currentPlanName: "",
  onPlanSelected: (e) => console.log("Selected plan:", e),
  canForcePlan: false,
  onPlanForced: (e) => console.log("Forced plan:", e),
};

export default React.memo(Pricing);
