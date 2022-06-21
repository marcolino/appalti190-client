// ADMINPANEL2 - NEW CODE - BAD STYLING

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBeforeunload } from "react-beforeunload";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, itIT, /* TODO: add all supported languages */ GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import IconAvatar from "@mui/icons-material/Security";
import IconDelete from "@mui/icons-material/Delete";
//import { errorMessage } from "../libs/Misc";
import UserService from "../services/UserService";
import TokenService from "../services/TokenService";
import { toast } from "./Toast";
//import config from "../config";

const styles = theme => ({
  datagrid: {
    "& .adminpanel-table--row": {
      borderRadius: 1, //defaultBorderRadius,
      backgroundColor: theme.palette.tertiary.light,
    },
    "& .adminpanel-table--cell": {
      border: "none",
    },
  },
  root: {
    flexGrow: 1,
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
  tab: {
    backgroundColor: theme.palette.secondary.light,
  },
  tabIndicator: {
    backgroundColor: theme.palette.secondary.dark,
    height: 1,
  }
});

const useStyles = makeStyles((theme) => (styles(theme)));

const DataGridStyled = withStyles({
  root: {
    "& .MuiDataGrid-renderingZone": {
      maxHeight: "5px !important",
    },
    "& .MuiDataGrid-cell": {
      lineHeight: "none !important",
      maxHeight: "5px !important",
      whiteSpace: "normal",
    },
    "& .MuiDataGrid-row": {
      maxHeight: "5px !important",
    },
  },
})(DataGrid);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ADMINPANEL_USERS = 0;



function AdminPanelTabPanel(props) {
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

AdminPanelTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function AdminPanel(props) {
  const classes = useStyles();
  const history = useHistory();
  const [user/*, setUser*/] = useState(TokenService.getUser());
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [rowsPerPageOptions/*, setRowsPerPageOptions*/] = useState([5, 10, 20, 50, 100]);
  const [/*profile*/, setProfile] = useState(false);
  const [/*error*/, setError] = useState(false);
  //const [formState, setFormState] = useState({ xs: true, horizontalSpacing: 0 });
  const { t } = useTranslation();

  const [tabValue, setTabValue] = React.useState(props.tabValue);
  const [anyChanges/*, setAnyChanges*/] = React.useState(false);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<IconDelete />} onClick={(e) => {console.log("DELETE", e)}} label={t("Delete")} />,
        // <GridActionsCellItem icon={...} onClick={...} label="Print" showInMenu />,
      ]
    },
    // {
    //   field: "id",
    //   headerName: "ID",
    //   minWidth: 350,
    //   editable: false,
    //   sortable: false,
    // },
    {
      field: "firstName",
      headerName: t("First Name"),
      minWidth: 100,
      flex: 1, // TODO: add fles for all columns...s
      editable: true,
    },
    {
      field: "lastName",
      headerName: t("Last Name"),
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "email",
      headerName: t("Email"),
      minWidth: 240,
      flex: 1,
      editable: true,
    },
    {
      field: "businessName",
      headerName: t("Business name"),
      minWidth: 150,
      flex: 1,
      editable: true,
    },
    {
      field: "fiscalCode",
      headerName: t("Fiscal code"),
      minWidth: 180,
      flex: 1,
      editable: true,
    },
    {
      field: "roles",
      headerName: t("Role"),
      minWidth: 170,
      flex: 1,
      editable: true,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.roles.map(role => role.name).join(", ") || ""}`,
      type: "singleSelect",
      valueOptions: ["user", "admin"],
      // multiple select is not supported yet...
      // here is a dempo how to implement it: https://codesandbox.io/s/columntypesgrid-material-demo-forked-4bbcrv?file=/demo.js
    },
    {
      field: "plan",
      headerName: t("Plan"),
      minWidth: 150,
      flex: 1,
      editable: true,
      // valueGetter: (params: GridValueGetterParams) => {
      //   console.log("plan valueGetter", params);
      //   return `${t(params.row.plan.name) || t("free")}`;
      // },
      // valueSetter: (params: GridValueSetterParams) => {
      //   console.log("plan valueSetter", params);
      //   return { ...params.row, plan: { ...params.row.plan, name: `${t(params.value) || t("free")}` }};
      // },
      type: "singleSelect",
      valueOptions: [t("free"), t("standard"), t("unlimited")],
    },
    {
      field: "address.street",
      headerName: t("Street"),
      minWidth: 180,
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address.street || ""}`,
    },
    {
      field: "address.streetno",
      headerName: t("N°"),
      minWidth: 10,
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address.streetNo || ""}`,
    },
    {
      field: "address.city",
      headerName: t("City"),
      minWidth: 70,
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address.city || ""}`,
    },
    {
      field: "address.zip",
      headerName: t("ZIP"),
      minWidth: 70,
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address.zip || ""}`,
    },
    {
      field: "address.province",
      headerName: t("Pr."),
      minWidth: 15,
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address.province || ""}`,
    },
    {
      field: "address.country",
      headerName: t("Country"),
      minWidth: 80,
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address.country || ""}`,
    },
  ];
  
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
    if (!user?.id) {
      toast.error(t("User must be authenticated"));
      history.goBack();
    }
  }, [user?.id, history, t]);

  // // set up event listener to set correct grid rowSpacing based on inner width
  // useEffect(() => {
  //   const setResponsiveness = () => {
  //     window.innerWidth < config.ui.extraSmallWatershed
  //       ? setFormState((prevState) => ({ ...prevState, xs: true, rowSpacing: 0 }))
  //       : setFormState((prevState) => ({ ...prevState, xs: false, rowSpacing: 2 }));
  //   };
  //   setResponsiveness();
  //   window.addEventListener("resize", () => setResponsiveness());
  //   return () => {
  //     window.removeEventListener("resize", () => setResponsiveness());
  //   };
  // }, []);

  // get user profile on load
  useEffect(() => {
    UserService.getAdminPanel().then(
      result => {
        if (result instanceof Error) {
          console.error("getAdminPanel error:", result);
          return setError({ code: result.message });
        }
        console.log(`getAdminPanel got successfully:`, result.users);

        result.users = result.users.map(user => ({
          ...user,
          id: user._id, // copy _id to id, a requiste of DataGrid
          plan: user.plan.name, // flatten plan
          //roles: user.roles.map(role => role.name).join(", ",)
          roles: user.roles[0].name, // get the first role only, we don't implement yet multiple select...
        }));

//result.users = result.users.slice(0, 1);
        // TODO: debug olnly - multiplicate users...
        if (result.users.length >= 3) {
          for (var i = 0; i < 1000; i++) {
            result.users.push(JSON.parse(JSON.stringify(result.users[i%3])));
            result.users[result.users.length-1].id = result.users[result.users.length-1].id  + "-" + Math.floor(Math.random() * 999999999);
          }
        }

        setUsers(result.users); // we have to update local state outside this useEffect, otherwise there is a really long delay in each set function...
      }
    );
  }, [user?.id, setError, setProfile, t]);
  
  // const formAdminPanelUpdate = (e) => {
  //   e.preventDefault();
  //   setError({});

  //   UserService.updateProfile({
  //     /*... */
  //   }).then(
  //     result => {
  //       if (result instanceof Error) {
  //         console.error("profileUpdate error:", result);
  //         toast.warn(errorMessage(result));
  //         return setError({ code: result.message });
  //       }
  //       setAnyChanges(false);
  //       toast.success(`User updated successfully`);
  //     }
  //   );
  // };

  return (
    <div className={classes.root}>

      <Container> {/* maxWidth="sm"*/}

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
            aria-label="tabs administrator's panel"
          >
            <Tab label={t("Users")} {...a11yProps(0)} />
          </Tabs>
        </AppBar>

        <AdminPanelTabPanel value={tabValue} index={ADMINPANEL_USERS}>
      
          {/* <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>
            </fieldset>
          </form> */}

          <Box m={3} />

          {/* <div style={{ height: "500px", width: "100%" }}>TODO: height should be proportional with window.height */}
            <DataGridStyled
              rows={users}
              columns={columns}
              localeText={itIT.components.MuiDataGrid.defaultProps.localeText /* TDO: usee current language*/}
              experimentalFeatures={{ newEditingApi: true } /* TODO: remove with @mui/x-data-grid v6 */ }
              autoHeight
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={rowsPerPageOptions}
              pagination
              checkboxSelection
              disableSelectionOnClick
              className={classes.datagrid}
              getRowClassName={() => "adminpanel-table--row"}
              onCellEditCommit={(e) => console.log(`Edited row - id: ${e.id}, field: ${e.field}, value: ${e.value}`, e) /* TODO: handle edit commit serialization */}
              rowHeight={36}
              /* available only in the PRO version...
                initialState={{ pinnedColumns: { / *left: ['name'],* / right: ['actions'] }}}
              */
            />
          {/* </div> */}
        </AdminPanelTabPanel>

        {/* <Grid container justifyContent="center">
          <FormButton
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus={true}
            onClick={formAdminPanelUpdate}
          >
            {
              t("Update")
            }
          </FormButton>
        </Grid>

        <Box m={1} /> */}

      </Container>

    </div>
  );
}

AdminPanel.propTypes = {
  tabValue: PropTypes.number,
};

AdminPanel.defaultProps = {
  tabValue: ADMINPANEL_USERS,
};



export default React.memo(AdminPanel);
