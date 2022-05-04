import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import AccountBoxOutlined from "@material-ui/icons/AccountBoxOutlined";
import Person from "@material-ui/icons/Person";
import IconEmail from "@material-ui/icons/Email";
import IconAddressStreet from "@material-ui/icons/House";
import IconAddressStreetNo from "@material-ui/icons/LooksOne";
import IconAddressCity from "@material-ui/icons/LocationCity";
import IconAddressProvince from "@material-ui/icons/Room";
import IconAddressZip from "@material-ui/icons/Code";
import IconAddressCountry from "@material-ui/icons/Language";
import IconFiscalCode from "@material-ui/icons/AssignmentInd";
import { errorMessage } from "../../libs/Misc";
import UserService from "../../services/UserService";
import TokenService from "../../services/TokenService";
import { toast } from "../Toast";
import { FormInput, FormButton, FormText } from "../FormElements";
import config from "../../config";

const styles = theme => ({
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
  fieldsetAddress: {
    border: 1,
    borderStyle: "solid",
    borderColor: "#aaa",
    borderRadius: 5,
  },
});
const useStyles = makeStyles((theme) => (styles(theme)));



function Profile(props) {
  const classes = useStyles();
  const user = TokenService.getUser();
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const [addressStreet, setAddressStreet] = useState("");
  const [addressStreetNo, setAddressStreetNo] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressProvince, setAddressProvince] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [fiscalCode, setFiscalCode] = useState("");
  const [error, setError] = useState({});
  const [formState, setFormState] = useState({ xs: true, horizontalSpacing: 0 });
  const { t } = useTranslation();


  useEffect(() => {
    console.log("Profile user:", user?.id);
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
        console.log(`profile got successfully:`, result);
        setEmail(result.user.email ? result.user.email : "");
        setFirstName(result.user.firstName ? result.user.firstName : "");
        setLastName(result.user.lastName ? result.user.lastName : "");
        setAddressStreet(result.user.address.street ? result.user.address.street : "");
        setAddressStreetNo(result.user.address.streetNo ? result.user.address.streetNo : "");
        setAddressCity(result.user.address.city ? result.user.address.city : "");
        setAddressProvince(result.user.address.province ? result.user.address.province : "");
        setAddressZip(result.user.address.zip ? result.user.address.zip : "");
        setAddressCountry(result.user.address.country ? result.user.address.country : "");
        setFiscalCode(result.user.fiscalCode ? result.user.fiscalCode : "");
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

  console.log("Updating address:", address);
    UserService.updateProfile({
      email,
      firstName,
      lastName,
      address,
      fiscalCode,
    }).then(
      result => {
        if (result instanceof Error) {
          console.error("profileUpdate error:", result);
          toast.error(errorMessage(result));
          return setError({ code: result.message });
        }
        toast.success(`profile updated successfully`);
      }
    );
  };

  return (
    <Container maxWidth="xs">

      <form className={classes.form} noValidate autoComplete="off">
        <fieldset className={classes.fieldset}>
          <Box m={1} />

          <Grid container justifyContent="center">
            <Avatar className={classes.avatar}>
              <AccountBoxOutlined />
            </Avatar>
          </Grid>

          <Box m={3} />

          <Grid container justifyContent="flex-start">
            <FormText>
              {t("Update your profile")}
            </FormText>
          </Grid>

          <Box m={1} />

          <Tooltip
            title={t("Email")}
            placement={"left"}
          >
            <Grid item xs={12}>
              <FormInput
                id={"email"}
                value={email}
                onChange={setEmail}
                placeholder={t("Email")}
                startAdornmentIcon={<IconEmail />}
                error={error.email}
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
                  autoFocus
                  id={"firstName"}
                  value={firstName}
                  onChange={setFirstName}
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
                  onChange={setLastName}
                  placeholder={t("Last Name")}
                  startAdornmentIcon={<Person />}
                  error={error.lastName}
                />
              </Grid>
            </Tooltip>
          </Grid>

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
                    onChange={setAddressStreet}
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
                    onChange={setAddressStreetNo}
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
                    onChange={setAddressCity}
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
                    onChange={setAddressProvince}
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
                    onChange={setAddressZip}
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
                    onChange={setAddressCountry}
                    placeholder={t("Country")}
                    startAdornmentIcon={<IconAddressCountry />}
                    error={error.addressCountry}
                  />
                </Grid>
              </Tooltip>
      
            </Grid>

          </fieldset>

          <Tooltip
            title={t("Fiscal code")}
            placement={"left"}
          >
            <Grid item xs={12}>
              <FormInput
                id={"fiscalCode"}
                value={fiscalCode}
                onChange={setFiscalCode}
                placeholder={t("Fiscal code")}
                startAdornmentIcon={<IconFiscalCode />}
                error={error.fiscalCode}
              />
            </Grid>
          </Tooltip>

          <Box m={1} />

          <FormButton
            onClick={formProfileupdate}
          >
            {t("Update")}
          </FormButton>

          <Box m={1} />

        </fieldset>
      </form>
    </Container>
  );
}

export default React.memo(Profile);
