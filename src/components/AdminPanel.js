import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBeforeunload } from "react-beforeunload";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Paper from '@mui/material/Paper';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { DataGrid, itIT, frFR, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import IconAvatar from "@mui/icons-material/Security";
import IconDelete from "@mui/icons-material/Delete";
import IconForceLogout from "@mui/icons-material/Lock";
import i18n from "i18next";
import { errorMessage, flattenObject } from "../libs/Misc";
import UserService from "../services/UserService";
import TokenService from "../services/TokenService";
import { getCurrentLanguage } from "../libs/I18n";
import { toast } from "./Toast";
//import config from "../config";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  datagrid: {
    // disable data-grid outlines
    "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-columnHeaderCheckbox:focus-within, & .MuiDataGrid-columnHeaderCheckbox:focus": {
      outline: "none",
    },

    "& .adminpanel-table--row": {
      borderRadius: 1, //defaultBorderRadius,
      backgroundColor: theme.palette.tertiary.light,
      outline: "none",
    },
    // "& .adminpanel-table--cell": {
    //   border: "none",
    //   outline: "none",
    // },
    // "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-cellCheckbox:focus, &.MuiDataGrid-root .MuiDataGrid-sortIcon:focus": {
    //   outline: "none",
    // },
    // "&.MuiCheckbox-root .MuiDataGrid-cellCheckbox:focus": {
    //   outline: "none !important",
    // },
    // "& .MuiDataGrid-columnHeader,  .MuiDataGrid-cell,  .MuiDataGrid-cellCheckbox":
    //     {
    //       border: 0,
    //       "& :focus-within": {
    //         outline: "none"
    //       }
    //     },
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
  },
});

const useStyles = makeStyles((theme) => (styles(theme)));

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
  const [user] = useState(TokenService.getUser());
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [rowsPerPageOptions/*, setRowsPerPageOptions*/] = useState([5, 10, 20, 50, 100]);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [/*error*/, setError] = useState(false);
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(props.tabValue);
  const [anyChanges] = useState(false);
  const [language] = useState(getCurrentLanguage(i18n));
  const [localeText] = useState(() => { /* use current language for MuiDataGrid locale text */
    switch (language) {
      case "it":
        return itIT.components.MuiDataGrid.defaultProps.localeText;
      case "fr":
        return frFR.components.MuiDataGrid.defaultProps.localeText;
      default:
        return null; // use default language for MuiDataGrid locale text
    }
  });
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: t("Actions"),
      type: 'actions',
      width: 90,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          label={t("Delete")}
          icon={<IconDelete />}
          onClick={(e) => {console.log("DELETE", e)}}
        />,
        <GridActionsCellItem
          label={t("Force logout")}
          icon={<IconForceLogout />}
          onClick={(e) => {console.log("FORCE LOGOUT", e)}}
        />,
      ],
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
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("firstName", params),
    },
    {
      field: "lastName",
      headerName: t("Last Name"),
      minWidth: 120,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("lastName", params),
    },
    {
      field: "email",
      headerName: t("Email"),
      minWidth: 240,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("email", params),
    },
    {
      field: "businessName",
      headerName: t("Business name"),
      minWidth: 150,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("businessName", params),
    },
    {
      field: "fiscalCode",
      headerName: t("Fiscal code"),
      minWidth: 180,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("fiscalCode", params),
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
      valueOptions: ["user", "admin"], // TODO: read from server
    },
    {
      field: "plan",
      headerName: t("Plan"),
      minWidth: 150,
      flex: 1,
      editable: true,
      // valueGetter: (params: GridValueGetterParams) => {
      //   console.log("plan valueGetter", params);
      //   return _t(params.row.plan.name) || t("free");
      // },
      // valueSetter: (params: GridValueSetterParams) => {
      //   console.log("plan valueSetter", params);
      //   return { ...params.row, plan: { ...params.row.plan, name: _t(params.value) || t("free") }};
      // },
      type: "singleSelect",
      valueOptions: [t("free"), t("standard"), t("unlimited")], // TODO: read from server
    },
    {
      field: "addressStreet",
      headerName: t("Street"),
      minWidth: 180,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("addressStreet", params),
    },
    // {
    //   field: "addressstreet",
    //   headerName: t("Street"),
    //   minWidth: 180,
    //   flex: 1,
    //   editable: true,
    //   preProcessEditCellProps: params => preProcessEditCellValidation("addressstreet", params),
    //   // valueGetter: (params: GridValueGetterParams) =>
    //   //   `${params.row.address?.street || ""}`,
    //   //valueFormatter: params => {console.log("£££££££££££", params); return params.row?.address?.street},
    //   // valueGetter: (params) => {
    //   //   console.log({ params });
    //   //   return params?.row?.address?.street ? params.row.address.street : "NOSTREET";
    //   // },
    //   // valueSetter: (params) => {
    //   //   console.log({ params });
    //   //   return params?.row;
    //   // },
    //   //valueGetter: params => params.row["address.street"],
    //   //valueSetter: params => params.row,
    //   //renderCell: params => params.row["address_street"],
    // },
    {
      field: "address.streetNo",
      headerName: t("N°"),
      minWidth: 50,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("address.streetNo", params),
      renderCell: (params) => params.row["address.streetNo"],
    },
    {
      field: "address.city",
      headerName: t("City"),
      minWidth: 90,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("address.city", params),
      renderCell: (params) => params.row["address.city"],
    },
    {
      field: "address.zip",
      headerName: t("ZIP"),
      minWidth: 70,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("address.zip", params),
      renderCell: (params) => params.row["address.zip"],
    },
    {
      field: "address.province",
      headerName: t("Pr."),
      minWidth: 50,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("address.province", params),
      renderCell: (params) => params.row["address.province"],
    },
    {
      field: "address.country",
      headerName: t("Country"),
      minWidth: 80,
      flex: 1,
      editable: true,
      preProcessEditCellProps: params => preProcessEditCellValidation("address.country", params),          
      renderCell: (params) => params.row["address.country"],
    },
  ];
  
  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const preProcessEditCellValidation = async(property, params) => {
console.log("*** preProcessEditCellValidation property, params:", property, params);
    return new Promise((resolve, reject) => {
      return UserService.updateUserProperty({
        userId: params.id,
        propertyName: property,
        propertyValue: params.props.value,
      }).then(
        result => {
          if (result instanceof Error) {
            toast.dismiss(); // avoid too high toasts stack
            toast.warn(errorMessage(result));
            reject({...params.props, error: true});
          } else {
            //toast.success(result.message);
console.log("*** preProcessEditCellValidation result:", result);
            params.props.value = result.propertyValue; // update value if normalized serverside
            resolve({...params.props, error: false});
          }
        },
      )
    });
  };

  const onCellEditCommit = (params) => {
    toast.success(t("Field updated"));
  }

  const onSelectionChange = newSelection => {
    console.warn(newSelection.rows + " selected users");
  };

  // check user is authenticated
  useEffect(() => {
    if (!user?.id) {
      toast.error(t("User must be authenticated"));
      history.goBack();
    }
  }, [user?.id, history, t]);
  
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
          //...user,
          ...flattenObject(user, "address"), // user with flattened address
          id: user._id, // copy _id to id, a requiste of DataGrid
          plan: user.plan.name, // flatten plan
          roles: user.roles[0].name, // get the first role only, we don't yet use multiple select here...
        }));

        // DEBUG ONLY: multiplicate users
        // if (result.users.length >= 3) {
        //   for (var i = 0; i < 36; i++) {
        //     result.users.push(JSON.parse(JSON.stringify(result.users[i%3])));
        //     result.users[result.users.length-1].id = result.users[result.users.length-1].id  + "-" + Math.floor(Math.random() * 999999999);
        //   }
        // }

console.log(`getAdminPanel got successfully after flattening:`, result.users);
        setUsers(result.users); // we have to update local state outside this useEffect, otherwise there is a really long delay in each set function...
        setUsersLoaded(true); // to distinguish an empty users set and a grid not yet loaded
      }
    );
  }, [user?.id, setError, t]);
  
console.log("USERS:", users);
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

        <AppBar elevation={0} position="static">
          <Paper elevation={1} square>
            <Tabs
              value={tabValue}
              onChange={handleChangeTabValue}
              variant="standard"
              aria-label="tabs administrator's panel"
              classes={{
                indicator: classes.tabIndicator
              }}
              className={classes.tab}
              >
              <Tab
                label={t("Users")}
                {...a11yProps(0)}
              />
            </Tabs>
          </Paper>
        </AppBar>

        <AdminPanelTabPanel value={tabValue} index={ADMINPANEL_USERS}>
      
          {/* <form className={classes.form} noValidate autoComplete="off">
            <fieldset className={classes.fieldset}>
            </fieldset>
          </form> */}

          <Box m={3} />

          <DataGrid
            rows={users}
            columns={columns}
            localeText={localeText}
            autoHeight
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={rowsPerPageOptions}
            pagination
            checkboxSelection
            disableSelectionOnClick
            className={classes.datagrid}
            getRowClassName={() => "adminpanel-table--row"}

            onCellEditCommit={(params: GridCellEditStopParams) => {
              onCellEditCommit(params);
            }}

            onSelectionChange={newSelection => {
              onSelectionChange(newSelection);
            }}
            onRowSelected={x => console.warn(x.api.current.getSlectedRows() + " selected users")}
            onSelectionModelChange={ids => {
              const selectedIDs = new Set(ids);
              setSelectedRowsCount(users.filter(user => selectedIDs.has(user.id.toString())).length);
            }}
            rowHeight={40}
            /* available only in the PRO version...
              initialState={{ pinnedColumns: { / *left: ['name'],* / right: ['actions'] }}}
            */
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {usersLoaded ? t("No users found") : t("Loading") + "..."}
                </Stack>
              ),
              // this does not seem to be working...
              // NoResultsOverlay: () => (
              //   <Stack height="100%" alignItems="center" justifyContent="center">
              //     Local filter returns no result
              //   </Stack>
              // )
            }}
            experimentalFeatures={{
              preventCommitWhileValidating: true,
              //newEditingApi: true,
            }}
          />

          <Box m={3} />

          {(selectedRowsCount > 0) && (
            <div>
              <Tooltip
                title={t("Delete all selected users")}
                placement="top"
              >
                <IconButton aria-label="delete all selected users" onClick={() => alert("delete all selected...")}>
                  <IconDelete />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("Force logout for all selected users")}
                placement="top"
              >
                <IconButton /*color="secondary"*/ aria-label="force logout for all selected users" onClick={() => alert("logout all selected...")}>
                  <IconForceLogout />
                </IconButton>
              </Tooltip>
            </div>
          )}

        </AdminPanelTabPanel>

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
