import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory/*, useLocation*/} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBeforeunload } from "react-beforeunload";
import makeStyles from '@mui/styles/makeStyles';
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
//import Tooltip from "@mui/material/Tooltip";
import IconAvatar from "@mui/icons-material/AccountBoxOutlined";
import IconPerson from "@mui/icons-material/Person";
import IconEmail from "@mui/icons-material/Email";
import IconFiscalCode from "@mui/icons-material/AssignmentInd";
import IconBusinessName from "@mui/icons-material/Business";
import IconAddressStreet from "@mui/icons-material/House";
import IconAddressStreetNo from "@mui/icons-material/LooksOne";
import IconAddressCity from "@mui/icons-material/LocationCity";
import IconAddressProvince from "@mui/icons-material/Room";
import IconAddressZip from "@mui/icons-material/Code";
import IconAddressCountry from "@mui/icons-material/Language";
import Pricing from "../../components/Pricing";
import { errorMessage/*, capitalize*/ } from "../../libs/Misc";
import UserService from "../../services/UserService";
import TokenService from "../../services/TokenService";
import JobService from "../../services/JobService";
import PaymentService from "../../services/PaymentService";
import EventBus from "../../libs/EventBus";
import { toast } from "../Toast";
import { FormInput, FormButton } from "../FormElements";
import config from "../../config";

const styles = theme => ({
  root: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
  },
  columnLeft: {
    marginLeft: theme.spacing(0.2),
  },
  columnRight: {
    marginLeft: "auto",
    marginRight: theme.spacing(0.2),
  },
  form: {
  },
  fieldset: {
    border: 0,
  },
  fieldsetPersonalData: {
    color: "#758c75",
    fontSize: 13,
    border: 1,
    borderStyle: "solid",
    borderColor: "#758c75",
    borderRadius: 5,
  },
  fieldsetCompanyData: {
    color: "#7a7aa5",
    fontSize: 13,
    border: 1,
    borderStyle: "solid",
    borderColor: "#7a7aa5",
    borderRadius: 5,
  },
  fieldsetAddress: {
    color: "#aaa",
    fontSize: 13,
    border: 1,
    borderStyle: "solid",
    borderColor: "#aaa",
    borderRadius: 5,
  },
  // title: {
  //   width: "100%",
  //   color: theme.palette.title.color,
  //   //backgroundColor: '#ccc', //theme.palette.title.backgroundColor,
  //   //borderRadius: 3,
  //   display: "flex",
  //   justifyContent: "center",
  //   paddingTop: 3,
  //   paddingBottom: 50,
  //   paddingLeft: 10,
  //   paddingRight: 10,
  // },
  formControlSelectPlan: {
    minWidth: 200,
  },
  formControlSelectRole: {
    minWidth: 200,
  },
  tab: {
    backgroundColor: theme.palette.secondary.light,
  },
  tabIndicator: {
    backgroundColor: theme.palette.secondary.dark,
    height: 1,
  },
});

const useStyles = makeStyles((theme) => (styles(theme)));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PROFILE_PERSONAL = 0;
const PROFILE_PLAN = 1;
const PROFILE_ROLES = 2;



function ProfileTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box p={3}>
        {children}
      </Box>
    </Typography>
  );
}

ProfileTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function Profile(props) {
//console.log("PROFILE - props:", props);
  const classes = useStyles();
  const history = useHistory();
  //const location = useLocation();
//console.log("PROFILE - location.state:", location.state);
  const [user, setUser] = useState(TokenService.getUser());
  const [profile, setProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fiscalCode, setFiscalCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState({});
  const [addressStreet, setAddressStreet] = useState("");
  const [addressStreetNo, setAddressStreetNo] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressProvince, setAddressProvince] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [plan, setPlan] = useState({});
  const [plans, setPlans] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesNames, setRolesNames] = useState([]);
  const [error, setError] = useState({});
  const { t } = useTranslation();
  const [tabValue, setTabValue] = React.useState(props?.location?.state?.tabValue ? props?.location?.state?.tabValue : 0);
  const [anyProfileChanges, setAnyProfileChanges] = React.useState(false);
  const [anyRolesChanges, setAnyRolesChanges] = React.useState(false);
  const [anyPlanChanges, setAnyPlanChanges] = React.useState(false);

  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // avoid page unload when unsaved changes present
  useBeforeunload((event) => {
    if (anyProfileChanges || anyRolesChanges || anyPlanChanges) {
      event.preventDefault();
    }
  });
  
  // avoid history route change when unsaved changes present
  useEffect(() => {
console.log("useeffect block");
    const unblock = history.block((location, action) => {
      if (anyProfileChanges || anyRolesChanges || anyPlanChanges) {
        return window.confirm(t("Are you sure to ignore unsaved data?"));
      }
      return true;
    });
  
    return () => {
      unblock();
    };
  }, [anyProfileChanges, anyRolesChanges, anyPlanChanges, history, t]);
  
  useEffect(() => {
console.log("useeffect profile:", profile);
    if (profile) {
      setEmail(profile.email ?? "");
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setFiscalCode(profile.fiscalCode ?? "");
      setBusinessName(profile.businessName ?? "");
      setAddressStreet(profile.address?.street ?? "");
      setAddressStreetNo(profile.address?.streetNo ?? "");
      setAddressCity(profile.address?.city ?? "");
      setAddressProvince(profile.address?.province ?? "");
      setAddressZip(profile.address?.zip ?? "");
      setAddressCountry(profile.address?.country ?? "");
      setPlan(profile.plan ?? {name: "free"});
      setRoles(profile.roles ? profile.roles.map(role => role.name) : []);
      setAnyProfileChanges(false);
      setAnyRolesChanges(false);
      setAnyPlanChanges(false);
    }
  }, [profile]);

  useEffect(() => {
console.log("useeffect user.id");
    if (!user?.id) {
      toast.error(t("User must be authenticated"));
      history.goBack();
    }
  }, [user?.id, history, t]);

  // get user profile on load
  useEffect(() => {
console.log("useeffect getProfile");
    UserService.getProfile().then(
      result => {
        if (result instanceof Error) {
          console.error("getProfile error:", result);
          return setError({ code: result.message });
        }
        //console.log(`profile got successfully:`, result);
        setProfile(result.user); // we have to update local state outside this useEffect, otherwise there is a really long delay in each set function...
      }
    );
    JobService.getPlans().then(
      result => {
        if (result instanceof Error) {
          console.error("getPlans error:", result);
          return setError({ code: result.message });
        }
    console.log(`plans got successfully:`, result);
        setPlans(result.data);
      }
    );
    UserService.getRoles().then(
      result => {
        if (result instanceof Error) {
          console.error("getRoles error:", result);
          return setError({ code: result.message });
        }
console.log(`roles got successfully:`, result);
        setRolesNames(result.map(role => role.name));
      }
    );
    PaymentService.mode().then(
      result => {
        if (result instanceof Error) {
          console.error("mode error:", result);
          return setError({ code: result.message });
        }
        console.log("mode:", result);
        setPaymentMode(result.mode);
      }
    );
  }, [user?.id]);
  
  useEffect(() => {
    setAddress({
      street: addressStreet,
      streetNo: addressStreetNo,
      city: addressCity,
      province: addressProvince,
      zip: addressZip,
      country: addressCountry,
    });
  }, [addressStreet, addressStreetNo, addressCity, addressProvince, addressZip, addressCountry]);

  const createCheckoutSession = (product) => {
    PaymentService.createCheckoutSession({product: product.name}).then(
      result => {
        //console.log(`createCheckoutSession got successfully:`, result);
        if (!result?.session?.url) {
          return toast.error(t("Sorry, could not get the payment page"));
        }
        window.location = result.session.url; // redirect to payment session success_url
      },
      error => {
        console.error("createCheckoutSession error:", error);
        toast.error(errorMessage(error));
      },
    );
  };

  const formProfileUpdate = (e) => {
    e.preventDefault();
    setError({});

    UserService.updateProfile({
      email,
      firstName,
      lastName,
      fiscalCode,
      businessName,
      address,
      roles,
    }).then(
      result => {
        if (result instanceof Error) {
          console.error("profileUpdate error:", result);
          toast.warn(errorMessage(result));
          return setError({ code: result.message });
        }
        setAnyProfileChanges(false);
        toast.success(t("Profile updated successfully"));
      }
    );
  };

  const formRolesUpdate = (e) => {
    // refresh user roles in local state and in token service (local storage) too
    user.roles = ((String)(roles)).split(",");
console.log("USER.ROLES:", user.roles, typeof user.roles);
    if (!user.roles || !user.roles.length || user.roles.every(role => role === "")) {
      user.roles = config.api.rolesNamesDefault; // if empty roles, use rolesNamesDefault
      setRoles(user.roles);
console.log("USER.ROLES DEFAULTS TO:", user.roles, typeof user.roles);
    }
console.log("*** USER:", user);
    setUser(user);
    TokenService.setUser(user);
    UserService.updateRoles({
      roles: user.roles,
    }).then(
      result => {
        if (result instanceof Error) {
          console.error("profileUpdate error:", result);
          toast.error(errorMessage(result));
          return setError({ code: result.message });
        }
        setRoles(user.roles);
        setAnyRolesChanges(false);
        EventBus.dispatch("roles-change");
        toast.success(t("Roles updated successfully"));
      }
    );
  };

  const formPlanSelect = (e, plan) => {
    // TODO: what to do with free plan selected?
    // TODO: what to do with plan downgrade?
    createCheckoutSession(plan);
  }

  const formPlanForce = (e, planName) => {
//console.log("formPlanForce:", e);
    if (userCanForcePlan()) {
      const p = plans.find(plan => plan.name === planName);
      //setPlan(p);
      user.plan = p;
      setUser(user);
      TokenService.setUser(user);
      UserService.updatePlan({
        plan: p.name,
      }).then(
        result => {
          if (result instanceof Error) {
            console.error("profileUpdate error:", result);
            toast.error(errorMessage(result));
            return setError({ code: result.message });
          }
          setPlan(plan);
          setAnyPlanChanges(false);
          EventBus.dispatch("plan-change");
          toast.success(t("Plan forced successfully"));
        },
        // error => {
        //   console.error("profileUpdate error:", result);
        //   toast.error(errorMessage(result));
        //   return setError({ code: result.message });
        // }
      );
    }
  };

  const userCanUpdateRoles = ()  => {
    return user?.roles?.includes("admin");
  };

  const userCanForcePlan = ()  => {
    return user?.roles?.includes("admin");
  };
  
  return (
    <div className={classes.root}>

      <Container maxWidth={"sm"}>
        <Box m={1} />

        <Grid container justifyContent="center">
          <Avatar className={classes.avatar}>
            <IconAvatar />
          </Avatar>
        </Grid>

        <Box m={3} />

        <AppBar position="static">
          <Tabs
            value={tabValue}
            onChange={handleChangeTabValue}
            variant="standard"
            aria-label="tabs for user's personal profile"
            classes={{
              indicator: classes.tabIndicator
            }}
            className={classes.tab}
          >
            <Tab label={t("Your profile")} {...a11yProps(0)} />
            <Tab label={t("Your plan")} {...a11yProps(1)} />
            <Tab label={t("Your role(s)")} {...a11yProps(2)} />
          </Tabs>
        </AppBar>
      </Container>

      <Container maxWidth={(tabValue === PROFILE_PLAN) ? "md" : "sm"}>
        {(tabValue === PROFILE_PERSONAL) &&
        <ProfileTabPanel value={tabValue} index={PROFILE_PERSONAL}>
      
          <form name="form" className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>

              <Box m={3} />

              <fieldset className={classes.fieldsetPersonalData}>
                <legend>{t("Personal data")}</legend>

                {/* <Tooltip
                  title={t("Email")}
                  placement={"left"}
                > */}
                  <Grid item xs={12}>
                    <FormInput
                      id={"email"}
                      value={email}
                      onChange={v => { setAnyProfileChanges(true); setEmail(v); }}
                      placeholder={t("Email")}
                      startAdornmentIcon={<IconEmail />}
                      error={error.email}
                      autoFocus
                    />
                  </Grid>
                {/* </Tooltip> */}

                <Grid container direction={"row"} columnSpacing={{xs: 1, sm: 2, md: 3, lg: 4}} rowSpacing={0}>
                  {/* <Tooltip
                    title={t("First name")}
                    placement={"left"}
                  > */}
                    <Grid item xs={12} sm={6}>
                      <FormInput
                        id={"firstName"}
                        value={firstName}
                        onChange={v => { setAnyProfileChanges(true); setFirstName(v); }}
                        placeholder={t("First Name")}
                        startAdornmentIcon={<IconPerson />}
                        error={error.firstName}
                      />
                    </Grid>
                  {/* </Tooltip> */}

                  {/* <Tooltip
                      title={t("Last name")}
                      placement={"left"}
                    > */}
                    <Grid item xs={12} sm={6}>
                      <FormInput
                        id={"lastName"}
                        value={lastName}
                        onChange={v => { setAnyProfileChanges(true); setLastName(v); }}
                        placeholder={t("Last Name")}
                        startAdornmentIcon={<IconPerson />}
                        error={error.lastName}
                      />
                    </Grid>
                  {/* </Tooltip> */}
                </Grid>
              </fieldset>

              <Box m={1} />

              <fieldset className={classes.fieldsetCompanyData}>
                <legend>{t("Company data")}</legend>

                <Grid container direction={"row"} columnSpacing={{xs: 1, sm: 2, md: 3, lg: 4}} rowSpacing={0}>
                  {/* <Tooltip
                    title={t("Company fiscal code")}
                    placement={"left"}
                  > */}
                    <Grid item xs={12}>
                      <FormInput
                        id={"fiscalCode"}
                        value={fiscalCode}
                        onChange={v => { setAnyProfileChanges(true); setFiscalCode(v); }}
                        placeholder={t("Company fiscal code")}
                        startAdornmentIcon={<IconFiscalCode />}
                        error={error.fiscalCode}
                      />
                    </Grid>
                  {/* </Tooltip> */}

                  {/* <Tooltip
                    title={t("Company business name")}
                    placement={"left"}
                  > */}
                    <Grid item xs={12}>
                      <FormInput
                        id={"businessName"}
                        value={businessName}
                        onChange={v => { setAnyProfileChanges(true); setBusinessName(v); }}
                        placeholder={t("Company business name")}
                        startAdornmentIcon={<IconBusinessName />}
                        error={error.businessName}
                      />
                    </Grid>
                  {/* </Tooltip> */}
                </Grid>
                  
                <Box m={1} />

                <fieldset className={classes.fieldsetAddress}>
                  <legend>{t("Address")}</legend>

                  <Grid container direction={"row"} columnSpacing={{xs: 1, sm: 2, md: 3, lg: 4}} rowSpacing={0}>
                    {/* <Tooltip
                      title={t("Address street")}
                      placement={"left"}
                    > */}
                      <Grid item xs={12} sm={8}>
                        <FormInput
                          id={"addressStreet"}
                          value={addressStreet}
                          onChange={v => { setAnyProfileChanges(true); setAddressStreet(v); }}
                          placeholder={t("Street")}
                          startAdornmentIcon={<IconAddressStreet />}
                          error={error.addressStreet}
                        />
                      </Grid>
                    {/* </Tooltip> */}

                    {/* <Tooltip
                      title={t("Address street number")}
                      placement={"left"}
                    > */}
                      <Grid item xs={12} sm={4}>
                        <FormInput
                          id={"addressStreetNo"}
                          value={addressStreetNo}
                          onChange={v => { setAnyProfileChanges(true); setAddressStreetNo(v); }}
                          placeholder={t("N°")}
                          startAdornmentIcon={<IconAddressStreetNo />}
                          error={error.addressStreetNo}
                        />
                      </Grid>
                    {/* </Tooltip> */}

                    {/* <Tooltip
                      title={t("Address city")}
                      placement={"left"}
                    > */}
                      <Grid item xs={12}>
                        <FormInput
                          id={"addressCity"}
                          value={addressCity}
                          onChange={v => { setAnyProfileChanges(true); setAddressCity(v); }}
                          placeholder={t("City")}
                          startAdornmentIcon={<IconAddressCity />}
                          error={error.addressCity}
                        />
                      </Grid>
                    {/* </Tooltip> */}
        
                    {/* <Tooltip
                      title={t("Address province")}
                      placement={"left"}
                    > */}
                      <Grid item xs={12} sm={7}>
                        <FormInput
                          id={"addressProvince"}
                          value={addressProvince}
                          onChange={v => { setAnyProfileChanges(true); setAddressProvince(v); }}
                          placeholder={t("Province")}
                          startAdornmentIcon={<IconAddressProvince />}
                          error={error.addressProvince}
                        />
                      </Grid>
                    {/* </Tooltip> */}
        
                    {/* <Tooltip
                      title={t("Address ZIP code")}
                      placement={"left"}
                    > */}
                      <Grid item xs={12} sm={5}>
                        <FormInput
                          id={"addressZip"}
                          value={addressZip}
                          onChange={v => { setAnyProfileChanges(true); setAddressZip(v); }}
                          placeholder={t("ZIP")}
                          startAdornmentIcon={<IconAddressZip />}
                          error={error.addressZip}
                        />
                      </Grid>
                    {/* </Tooltip> */}

                    {/* <Tooltip
                      title={t("Address country")}
                      placement={"left"}
                    > */}
                      <Grid item xs={12}>
                        <FormInput
                          id={"addressCountry"}
                          value={addressCountry}
                          onChange={v => { setAnyProfileChanges(true); setAddressCountry(v); }}
                          placeholder={t("Country")}
                          startAdornmentIcon={<IconAddressCountry />}
                          error={error.addressCountry}
                        />
                      </Grid>
                    {/* </Tooltip> */}
                  </Grid>

                </fieldset>
              </fieldset>
            </fieldset>
          </form>
        </ProfileTabPanel>
        }

        {(tabValue === PROFILE_PLAN) &&
        <ProfileTabPanel value={tabValue} index={PROFILE_PLAN}>
          <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>
              <Pricing
                currentPlan={plan}
                onPlanSelected={formPlanSelect}
                canForcePlan={userCanForcePlan()}
                onPlanForced={formPlanForce}
                paymentMode={paymentMode}
              />
            </fieldset>
          </form>
        </ProfileTabPanel>
        }

        {(tabValue === PROFILE_ROLES) &&
        <ProfileTabPanel value={tabValue} index={PROFILE_ROLES}>
          <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>

              <Box m={3} />

                {/* <Tooltip
                  title={
                    userCanUpdateRoles() ?
                      t("Role(s)") + " (" + t("select one or more role") + ")"
                    :
                      t("Your role(s)")
                  }
                  placement={"left"}
                > */}
                  <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControlSelectRole}>
                      <InputLabel id="roles-label">{t("Role(s)")}</InputLabel>
                      <Select
                        labelId="roles-label"
                        id="roles"
                        multiple
                        value={roles}
                        onChange={e => { setAnyRolesChanges(true); setRoles(e.target.value); }}
                        label={t("Role(s)")}
                        disabled={!userCanUpdateRoles()}
                      >
                        {rolesNames.map((role, index) => (
                          <MenuItem key={index} value={role}>{role}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                {/* </Tooltip> */}
            </fieldset>
          </form>
        </ProfileTabPanel>
        }
      </Container>

      {(tabValue === PROFILE_PERSONAL) && (
        <Grid container justifyContent="center">
          <FormButton
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus={true}
            onClick={formProfileUpdate}
          >
            {t("Update")}
          </FormButton>
        </Grid>
      )}

      {(tabValue === PROFILE_ROLES) && userCanUpdateRoles() && (
        <Grid container justifyContent="center">
          <FormButton
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus={true}
            onClick={formRolesUpdate}
            //disabled={!userCanUpdateRoles()}
          >
            {t("Update")}
          </FormButton>
        </Grid>
      )}
      <Box m={1} />

    </div>
  );
}

Profile.propTypes = {
  tabValue: PropTypes.number,
};

Profile.defaultProps = {
  tabValue: PROFILE_PERSONAL,
};



export default React.memo(Profile);
