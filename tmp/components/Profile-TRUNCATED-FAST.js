import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
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
 import Tooltip from "@mui/material/Tooltip";
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
import PaymentService from "../../services/PaymentService";
import { toast } from "../Toast";
import { FormInput, FormButton, FormTooltip } from "../FormElements";
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



// function ProfileTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <Typography
//       component="div"
//       role="tabpanel"
//       hidden={value !== index}
//       id={`scrollable-auto-tabpanel-${index}`}
//       aria-labelledby={`nav-tab-${index}`}
//       {...other}
//     >
//       <Box p={3}>
//         {children}
//       </Box>
//     </Typography>
//   );
// }

// ProfileTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

function Profile(props) {
//console.log("PROFILE - props.location.state.tabValue:", props?.location?.state?.tabValue);
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = useState(TokenService.getUser());
  const [profile, setProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
const [lN, setLN] = useState("");
  const [fiscalCode, setFiscalCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState({});
  const [addressStreet, setAddressStreet] = useState("");
  const [addressStreetNo, setAddressStreetNo] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressProvince, setAddressProvince] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [plan, setPlan] = useState(null/*config.api.planNameDefault*/);
  const [roles, setRoles] = useState(config.api.rolesNamesDefault);
  const [error, setError] = useState({});
  const { t } = useTranslation();

  const [tabValue, setTabValue] = React.useState(props?.location?.state?.tabValue ? props?.location?.state?.tabValue : 0);
  const [anyChanges, setAnyChanges] = React.useState(false);

  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // // avoid page unload when unsaved changes present
  // useBeforeunload((event) => {
  //   if (anyChanges) {
  //     event.preventDefault();
  //   }
  // });
  
//   // avoid history route change when unsaved changes present
//   useEffect(() => {
// console.log("useeffect block");
//     const unblock = history.block((location, action) => {
//       if (anyChanges) {
//         return window.confirm(t("Are you sure to ignore unsaved data?"));
//       }
//       return true;
//     });
  
//     return () => {
//       unblock();
//     };
//   }, [anyChanges, history, t]);
  
//   useEffect(() => {
// console.log("useeffect profile");
//     if (profile) {
//       setEmail(profile.email ? profile.email : "");
//       setFirstName(profile.firstName ? profile.firstName : "");
//       setLastName(profile.lastName ? profile.lastName : "");
//       setFiscalCode(profile.fiscalCode ? profile.fiscalCode : "");
//       setBusinessName(profile.businessName ? profile.businessName : "");
//       setAddressStreet(profile.address.street ? profile.address.street : "");
//       setAddressStreetNo(profile.address.streetNo ? profile.address.streetNo : "");
//       setAddressCity(profile.address.city ? profile.address.city : "");
//       setAddressProvince(profile.address.province ? profile.address.province : "");
//       setAddressZip(profile.address.zip ? profile.address.zip : "");
//       setAddressCountry(profile.address.country ? profile.address.country : "");
//       setPlan(profile.plan ? profile.plan.name : ""/*config.api.planNameDefault*/);
//       setRoles(profile.roles ? profile.roles.map(role => role.name) : []);
//       setAnyChanges(false);
//     }
//   }, [profile]);

//   useEffect(() => {
// console.log("useeffect user.id");
//     if (!user?.id) {
//       toast.error(t("User must be authenticated"));
//       history.goBack();
//     }
//   }, [user?.id, history, t]);

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
  }, [user?.id]);
  
//   useEffect(() => {
// console.log("useeffect setAddress");
//     setAddress({
//       street: addressStreet,
//       streetNo: addressStreetNo,
//       city: addressCity,
//       province: addressProvince,
//       zip: addressZip,
//       country: addressCountry,
//     });
//   }, [addressStreet, addressStreetNo, addressCity, addressProvince, addressZip, addressCountry]);

  const createCheckoutSession = (product) => {
    PaymentService.createCheckoutSession({product}).then(
      result => {
        if (result instanceof Error) { // TODO:
          console.error("createCheckoutSession error:", result);
          return toast.error(errorMessage(result));
        }
        console.log(`createCheckoutSession got successfully:`, result);
        if (!result?.session?.url) {
          return toast.error(t("Sorry, could not get the payment page"));
        }
        window.location = result.session.url; // redirect to payment session success_url
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
        setAnyChanges(false);
        toast.success(t("Profile updated successfully"));
      }
    );
  };

  const formPlanSelect = (e, planName) => {
    // TODO: what to do with free plan selected?
    // TODO: what to do with plan downgrade?
    createCheckoutSession(planName);
  }

  const formPlanForce = (e, planName) => {
    if (userCanForcePlan()) {
      //setUser({...user, plan: planName}); // TODO: ok?
      TokenService.setUser(user);
      UserService.updatePlan({
        plan: planName,
      }).then(
        result => {
          if (result instanceof Error) {
            console.error("profileUpdate error:", result);
            toast.error(errorMessage(result));
            return setError({ code: result.message });
          }
          setPlan(planName);
          toast.success(t("Plan forced successfully"));
        }
      );
    }
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
        //setAnyChanges(false);
        //toast.success(`roles updated successfully`);
      }
    );
  };

  const userCanUpdateRoles = ()  => {
    return user?.roles?.includes("admin");
  };

  const userCanForcePlan = ()  => {
    return user.roles.includes("admin");
  };
  
  return (
    <div className={classes.root}>

      <input />

      <Container maxWidth={(tabValue === PROFILE_PLAN) ? "md" : "sm"}>
      
          <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>
                <Grid container direction={"row"} columnSpacing={{xs: 1, sm: 2, md: 3, lg: 4}} rowSpacing={0}>
                  {/* <FormTooltip title={t("Last name")} enterDelay={1500} enterNextDelay={2000} leaveDelay={200}> */}
                    <Grid item xs={12} sm={12}>
                      <FormInput
                        id={"lastName"}
                        value={lN}
                        onChange={v => { /*setAnyChanges(true);*/ setLN(v); }}
                        placeholder={t("Last Name")}
                        startAdornmentIcon={<IconPerson />}
                        error={error.lastName}
                      />
                    </Grid>
                  {/* </FormTooltip> */}
                </Grid>
            </fieldset>
          </form>
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

      {/* {(tabValue === PROFILE_ROLES) && userCanUpdateRoles() && (
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
      )} */}

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
