import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBeforeunload } from "react-beforeunload";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import AccountBoxOutlined from "@material-ui/icons/AccountBoxOutlined";
import Person from "@material-ui/icons/Person";
import IconEmail from "@material-ui/icons/Email";
import IconFiscalCode from "@material-ui/icons/AssignmentInd";
import IconBusinessName from "@material-ui/icons/Business";
import IconAddressStreet from "@material-ui/icons/House";
import IconAddressStreetNo from "@material-ui/icons/LooksOne";
import IconAddressCity from "@material-ui/icons/LocationCity";
import IconAddressProvince from "@material-ui/icons/Room";
import IconAddressZip from "@material-ui/icons/Code";
import IconAddressCountry from "@material-ui/icons/Language";
import { errorMessage, capitalize } from "../../libs/Misc";
import UserService from "../../services/UserService";
import TokenService from "../../services/TokenService";
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
  title: {
    width: "100%",
    color: theme.palette.title.color,
    //backgroundColor: '#ccc', //theme.palette.title.backgroundColor,
    //borderRadius: 3,
    display: "flex",
    justifyContent: "center",
    paddingTop: 3,
    paddingBottom: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  formControlSelectPlan: {
    minWidth: 200,
  },
  formControlSelectRole: {
    minWidth: 200,
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
  const classes = useStyles();
  const history = useHistory();
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
  const [plan, setPlan] = useState(config.api.planNameDefault);
  const [roles, setRoles] = useState(config.api.rolesNamesDefault);
  const [error, setError] = useState({});
  const [formState, setFormState] = useState({ xs: true, horizontalSpacing: 0 });
  const { t } = useTranslation();

  const [tabValue, setTabValue] = React.useState(props.tabValue);
  const [anyChanges, setAnyChanges] = React.useState(false);

  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // avoid page unload when unsaved changes present
  useBeforeunload((event) => {
    if (anyChanges) {
      event.preventDefault();
    }
  });
  
  // avoid history route change when unsaved changes present
  useEffect(() => {
    const unblock = history.block((location, action) => {
      if (anyChanges) {
        return window.confirm(t("Are you sure to ignore unsaved data?"));
      }
      return true;
    });
  
    return () => {
      unblock();
    };
  }, [anyChanges, history, t]);
  
  useEffect(() => {
    if (profile) {
      setEmail(profile.email ? profile.email : "");
      setFirstName(profile.firstName ? profile.firstName : "");
      setLastName(profile.lastName ? profile.lastName : "");
      setFiscalCode(profile.fiscalCode ? profile.fiscalCode : "");
      setBusinessName(profile.businessName ? profile.businessName : "");
      setAddressStreet(profile.address.street ? profile.address.street : "");
      setAddressStreetNo(profile.address.streetNo ? profile.address.streetNo : "");
      setAddressCity(profile.address.city ? profile.address.city : "");
      setAddressProvince(profile.address.province ? profile.address.province : "");
      setAddressZip(profile.address.zip ? profile.address.zip : "");
      setAddressCountry(profile.address.country ? profile.address.country : "");
      setPlan(profile.plan ? profile.plan.name : config.api.planNameDefault);
      setRoles(profile.roles ? profile.roles.map(role => role.name) : []);
      setAnyChanges(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!user?.id) {
      toast.error(t("User must be authenticated"));
      history.goBack();
    }
  }, [user?.id, history, t]);

  // set up event listener to set correct grid rowSpacing based on inner width
  useEffect(() => {
    const setResponsiveness = () => {
      window.innerWidth < config.extraSmallWatershed
        ? setFormState((prevState) => ({ ...prevState, xs: true, rowSpacing: 0 }))
        : setFormState((prevState) => ({ ...prevState, xs: false, rowSpacing: 2 }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  // get user profile on load
  useEffect(() => {
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

  const formProfileupdate = (e) => {
    e.preventDefault();
    setError({});

    if (tabValue === PROFILE_ROLES) {
      // refresh user roles in local state and in token service (local storage) too
      user.roles = ((String)(roles)).split(",");
console.log("USER.ROLES:", user.roles, typeof user.roles);
      if (!user.roles || !user.roles.length || user.roles.every(role => role === "")) {
        user.roles = config.api.rolesNamesDefault; // if empty roles, use rolesNamesDefault
        setRoles(user.roles);
console.log("USER.ROLES DEFAULTS TO:", user.roles, typeof user.roles);
      }
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
          //setAnyChanges(false);
          //toast.success(`roles updated successfully`);
        }
      );
    }

    if (tabValue === PROFILE_PLAN) { // redirect user to showcase page where she can buy a new plan
      if (userCanUpdatePlan()) {
        setUser({...user, plan});
        TokenService.setUser(user);
        UserService.updatePlan({
          plan,
        }).then(
          result => {
            if (result instanceof Error) {
              console.error("profileUpdate error:", result);
              toast.error(errorMessage(result));
              return setError({ code: result.message });
            }
            //setAnyChanges(false);
            //toast.success(`roles updated successfully`);
          }
        );
      } else { // regular user
        /*return*/ window.location.href = "https://appalti190-showcase.herokuapp.com/prices"; // TODO: REMOVE ME...
        //window.location.href = config.showcase.endpoint[(window.location.hostname === "localhost") ? "development" : "production"];
      }
    }

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
        setAnyChanges(false);
        toast.success(`Profile updated successfully`);
      }
    );
  };

  const userCanUpdateRoles = ()  => {
    return user.roles.includes("admin");
  };

  const userCanUpdatePlan = ()  => {
    return user.roles.includes("admin");
  };
  
  return (
    <div className={classes.root}>

      <Container maxWidth="sm">

        <Box m={1} />

        <Grid container justifyContent="center">
          <Avatar className={classes.avatar}>
            <AccountBoxOutlined />
          </Avatar>
        </Grid>

        <Box m={3} />

        <AppBar position="static">
          <Tabs
            value={tabValue}
            onChange={handleChangeTabValue}
            variant="standard"
            aria-label="tabs for user's personal"
          >
            <Tab label={t("Your profile")} {...a11yProps(0)} />
            <Tab label={t("Your plan")} {...a11yProps(1)} />
            <Tab label={t("Your role(s)")} {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <ProfileTabPanel value={tabValue} index={PROFILE_PERSONAL}>
      
          <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>

              {/* <Box m={1} /> */}

              {/* <Grid container justifyContent="flex-start">
                <FormText variant="subtitle1" className={classes.title}>
                  {t("Your profile")}
                </FormText>
              </Grid> */}

              <Box m={3} />

              <fieldset className={classes.fieldsetPersonalData}>
                <legend>{t("Personal data")}</legend>

                <Tooltip
                  title={t("Email")}
                  placement={"left"}
                >
                  <Grid item xs={12}>
                    <FormInput
                      id={"email"}
                      value={email}
                      onChange={v => { setAnyChanges(true); setEmail(v); }}
                      placeholder={t("Email")}
                      startAdornmentIcon={<IconEmail />}
                      error={error.email}
                      autoFocus
                    />
                  </Grid>
                </Tooltip>

                <Grid container direction={"row"} spacing={formState.rowSpacing}>
                  <Tooltip
                    title={t("First name")}
                    placement={"left"}
                  >
                    <Grid item xs={12} sm={6}>
                      <FormInput
                        id={"firstName"}
                        value={firstName}
                        onChange={v => { setAnyChanges(true); setFirstName(v); }}
                        placeholder={t("First Name")}
                        startAdornmentIcon={<Person />}
                        error={error.firstName}
                      />
                    </Grid>
                  </Tooltip>

                  <Tooltip
                      title={t("Last name")}
                      placement={"left"}
                    >
                    <Grid item xs={12} sm={6}>
                      <FormInput
                        id={"lastName"}
                        value={lastName}
                        onChange={v => { setAnyChanges(true); setLastName(v); }}
                        placeholder={t("Last Name")}
                        startAdornmentIcon={<Person />}
                        error={error.lastName}
                      />
                    </Grid>
                  </Tooltip>
                </Grid>
              </fieldset>

              <Box m={1} />

              <fieldset className={classes.fieldsetCompanyData}>
                <legend>{t("Company data")}</legend>

                <Tooltip
                  title={t("Company fiscal code")}
                  placement={"left"}
                >
                  <Grid item xs={12}>
                    <FormInput
                      id={"fiscalCode"}
                      value={fiscalCode}
                      onChange={v => { setAnyChanges(true); setFiscalCode(v); }}
                      placeholder={t("Company fiscal code")}
                      startAdornmentIcon={<IconFiscalCode />}
                      error={error.fiscalCode}
                    />
                  </Grid>
                </Tooltip>

                <Box m={1} />

                <Tooltip
                  title={t("Company business name")}
                  placement={"left"}
                >
                  <Grid item xs={12}>
                    <FormInput
                      id={"businessName"}
                      value={businessName}
                      onChange={v => { setAnyChanges(true); setBusinessName(v); }}
                      placeholder={t("Company business name")}
                      startAdornmentIcon={<IconBusinessName />}
                      error={error.businessName}
                    />
                  </Grid>
                </Tooltip>
                
                <Box m={1} />

                <fieldset className={classes.fieldsetAddress}>
                  <legend>{t("Address")}</legend>

                  <Grid container direction={"row"} spacing={formState.rowSpacing}>

                    <Tooltip
                      title={t("Address street")}
                      placement={"left"}
                    >
                      <Grid item xs={12} sm={8}>
                        <FormInput
                          id={"addressStreet"}
                          value={addressStreet}
                          onChange={v => { setAnyChanges(true); setAddressStreet(v); }}
                          placeholder={t("Street")}
                          startAdornmentIcon={<IconAddressStreet />}
                          error={error.addressStreet}
                        />
                      </Grid>
                    </Tooltip>

                    <Tooltip
                      title={t("Address street number")}
                      placement={"left"}
                    >
                      <Grid item xs={12} sm={4}>
                        <FormInput
                          id={"addressStreetNo"}
                          value={addressStreetNo}
                          onChange={v => { setAnyChanges(true); setAddressStreetNo(v); }}
                          placeholder={t("N°")}
                          startAdornmentIcon={<IconAddressStreetNo />}
                          error={error.addressStreetNo}
                        />
                      </Grid>
                    </Tooltip>

                    <Tooltip
                      title={t("Address city")}
                      placement={"left"}
                    >
                      <Grid item xs={12}>
                        <FormInput
                          id={"addressCity"}
                          value={addressCity}
                          onChange={v => { setAnyChanges(true); setAddressCity(v); }}
                          placeholder={t("City")}
                          startAdornmentIcon={<IconAddressCity />}
                          error={error.addressCity}
                        />
                      </Grid>
                    </Tooltip>
        
                    <Tooltip
                      title={t("Address province")}
                      placement={"left"}
                    >
                      <Grid item xs={12} sm={7}>
                        <FormInput
                          id={"addressProvince"}
                          value={addressProvince}
                          onChange={v => { setAnyChanges(true); setAddressProvince(v); }}
                          placeholder={t("Province")}
                          startAdornmentIcon={<IconAddressProvince />}
                          error={error.addressProvince}
                        />
                      </Grid>
                    </Tooltip>
        
                    <Tooltip
                      title={t("Address ZIP code")}
                      placement={"left"}
                    >
                      <Grid item xs={12} sm={5}>
                        <FormInput
                          id={"addressZip"}
                          value={addressZip}
                          onChange={v => { setAnyChanges(true); setAddressZip(v); }}
                          placeholder={t("Zip")}
                          startAdornmentIcon={<IconAddressZip />}
                          error={error.addressZip}
                        />
                      </Grid>
                    </Tooltip>

                    <Tooltip
                      title={t("Address country")}
                      placement={"left"}
                    >
                      <Grid item xs={12}>
                        <FormInput
                          id={"addressCountry"}
                          value={addressCountry}
                          onChange={v => { setAnyChanges(true); setAddressCountry(v); }}
                          placeholder={t("Country")}
                          startAdornmentIcon={<IconAddressCountry />}
                          error={error.addressCountry}
                        />
                      </Grid>
                    </Tooltip>
            
                  </Grid>

                </fieldset>

              </fieldset>

              <Box m={1} />

            </fieldset>
          </form>
        </ProfileTabPanel>

        <ProfileTabPanel value={tabValue} index={PROFILE_PLAN}>
          <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>

              <Box m={3} />

              {/* <fieldset className={classes.fieldsetPersonalData}>
                <legend>{t("Plan")}</legend> */}

                <Tooltip
                  title={t("Usage plan")}
                  placement={"left"}
                >
                  <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControlSelectPlan}>
                      <InputLabel id="plan-label">{t("Plan")}</InputLabel>
                      <Select
                        labelId="plan-label"
                        id="plan"
                        value={plan}
                        onChange={e => {
                        /**
                         * We don't want a not-admin user to change plan here... She should just see the possible plans list...
                         */
                          if (userCanUpdatePlan()) {
                            setAnyChanges(true); setPlan(e.target.value);
                          }
                        }}
                        label={t("Plan")}
                      >
                        {config.api.planNames.map((plan, index) => (
                          <MenuItem key={index} value={plan}>{capitalize(t(plan))}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Tooltip>
              {/* </fieldset> */}
            </fieldset>
          </form>
        </ProfileTabPanel>

        <ProfileTabPanel value={tabValue} index={PROFILE_ROLES}>
          <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>

              <Box m={3} />

              {/* <fieldset className={classes.fieldsetPersonalData}>
                <legend>{t("Plan")}</legend> */}

                <Tooltip
                  /* eslint-disable no-useless-concat */
                  title={
                    userCanUpdateRoles() ?
                      t("Role(s)") + " " + "(" + t("select one or more role") + ")"
                    :
                      t("Your role(s)")
                  }
                  placement={"left"}
                >
                  <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControlSelectRole}>
                      <InputLabel id="roles-label">{t("Role(s)")}</InputLabel>
                      <Select
                        labelId="roles-label"
                        id="roles"
                        multiple
                        value={roles}
                        onChange={e => { setAnyChanges(true); setRoles(e.target.value); }}
                        label={t("Role(s)")}
                        disabled={!userCanUpdateRoles()}
                      >
                        {config.api.rolesNames.map((plan, index) => (
                          <MenuItem key={index} value={plan}>{t(plan)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Tooltip>
              {/* </fieldset> */}
            </fieldset>
          </form>
        </ProfileTabPanel>

        <Grid container justifyContent="center">
          <FormButton
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus={true}
            onClick={formProfileupdate}
          >
            {
              (tabValue !== PROFILE_PLAN) ?
                t("Update")
              :
                t("Buy a new plan")
            }
          </FormButton>
        </Grid>

        <Box m={1} />

      </Container>

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
