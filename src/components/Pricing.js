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
import FlexibleDialog from "./FlexibleDialog";
import i18n from "i18next";
import { toast } from "./Toast";
import SelectedPlanImage_en from "../assets/images/SelectedPlan-en.png";
import SelectedPlanImage_it from "../assets/images/SelectedPlan-it.png";
import SelectedPlanImage_fr from "../assets/images/SelectedPlan-fr.png";
import JobService from "../services/JobService";
import { getCurrentLanguage } from "../libs/I18n";
import { capitalize, currencyISO4217ToSymbol, errorMessage } from "../libs/Misc";



const useStyles = makeStyles((theme) => ({
  section: {
  },
  cardHeader: {
    paddingTop: theme.spacing(3),
  },
  cardHeaderActive: {
    //fontWeight: "bold",
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
  card: {
    transition: "box-shadow .3s",
    borderRadius: 10,
    border: "1px solid #ccc",
    "&:hover": {
      boxShadow: "10px 10px 30px rgba(32, 32, 132, .5)",
    },
  },
  cardActive: {
    backgroundColor: "#e0e8ff",
  },
  cardActiveImage: {
    position: "absolute",
    marginLeft: 50,
    marginTop: -20,
    maxWidth: 80,
    transform: "rotate(15deg)",
    opacity: 0.6,
    zIndex: 999,
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
        setPlans(result.data);
      },
      error => {
        toast.error(errorMessage(error));
      }
    );
  }, [setPlans]);

  const isActivePlan = (p) => {
    return props.currentPlan.name === p.name;
  };
  
  const [language] = useState(getCurrentLanguage(i18n));
  let selectedPlanImage = null;
  switch (language) {
    case "en": selectedPlanImage = SelectedPlanImage_en; break;
    case "it": selectedPlanImage = SelectedPlanImage_it; break;
    case "fr": selectedPlanImage = SelectedPlanImage_fr; break;
    default: selectedPlanImage = SelectedPlanImage_en; break;
  }

  return (
    <section className={classes.section}>
      <Container>
        <Box py={0} textAlign="center">
          <Box mb={0}>
            <Container maxWidth="lg">
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
            {plans.map((p, index) => {
console.log("P:", p);
              return (
              <Grid key={index} item xs={12} md={parseInt(plans.length ? 12 / plans.length : 12)}>
                {isActivePlan(p) && (
                  <img className={classes.cardActiveImage} src={selectedPlanImage} alt={t("Selected plan stamp")} />
                )}
                <Card
                  variant="outlined"
                  className={[classes.card, isActivePlan(p) ? classes.cardActive : null, /*props.paymentMode !== "live" ? classes.cardRibbonTest : null*/].join(" ")}
                >
                  <CardHeader
                    title={capitalize(t(p.name))}
                    className={[classes.cardHeader, isActivePlan(p) ? classes.cardHeaderActive : null].join(" ")}
                    titleTypographyProps={isActivePlan(p) ? { /*fontWeight: "bold"*/ } : {}}
                  >
                  </CardHeader>
                  {props.paymentMode !== "live" ? <span className={classes.cardTest}> TEST </span> : <></>}
                  <hr className={classes.cardHr} />
                  <CardContent>
                    <Box px={1}>
                      <Typography variant="h4" component="h2" gutterBottom={true} style={{fontWeight: "bold"}}>
                        {currencyISO4217ToSymbol(p.priceCurrency)}
                        {perMonth ? p.pricePerMonth : p.pricePerYear}
                        {<Typography variant="h6" color="textSecondary" component="span"> / {perMonth ? t("month") : t("year")}</Typography>}
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="p">{
                        (p.cigNumberAllowed === Number.MAX_SAFE_INTEGER) ?
                          t("Unlimited CIG's")
                        :
                          t("Up to {{cigs}} CIG's", {cigs: p.cigNumberAllowed})
                      }</Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="div">{
                        p.supportTypes.map((supportType, index) => (
                          <div key={index}>{t("Support") + " " + t("by") + " " + t(supportType)}</div>
                        ))
                      }</Typography>
                      <br />
                    </Box>
                    <Button variant="contained" color="secondary"
                      onClick={(e) => {
                        openDialog({
                          title: t("Sure to buy this plan?"),
                          contentText: t("It allows processing of ") +
                            ((p.cigNumberAllowed === Number.MAX_SAFE_INTEGER) ?
                              t("unlimited CIG's")
                                :
                              t("up to {{cigs}} CIG's", {cigs: p.cigNumberAllowed})
                            ),
                          actions: [
                            {
                              callback: () => {
                                console.log("Clicked first action button");
                                props.onPlanSelected(e, p);
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
                      disabled={isActivePlan(p)}
                    >{
                      isActivePlan(p) ?
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
                            //props.currentPlan = plan;
                            //setPlan(p)
                            props.onPlanForced(e, p.name);
                          }}
                          disabled={isActivePlan(p)}
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
            )})}
          </Grid>
        </Box>
      </Container>
    </section>
  );
}

Pricing.propTypes = {
  currentPlan: PropTypes.object,
  onPlanSelected: PropTypes.func,
  canForcePlan: PropTypes.bool,
  onPlanForced: PropTypes.func,
};

Pricing.defaultProps = {
  currentPlan: {},
  onPlanSelected: (e) => console.log("Selected plan:", e),
  canForcePlan: false,
  onPlanForced: (e) => console.log("Forced plan:", e),
};

export default React.memo(Pricing);
