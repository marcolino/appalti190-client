import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
//import ListAltIcon from "@material-ui/icons/ListAlt";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SecurityIcon from '@material-ui/icons/Security';
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import IconCustom from "./IconCustom";
import IconGravatar from "./IconGravatar";
import ImageCustom from "./ImageCustom";
import AuthService from "../services/AuthService";
import { AuthContext } from "../providers/AuthProvider";
import { isAdmin } from "../libs/Validation";
import EventBus from "../libs/EventBus";
import config from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
  },
  offset: theme.mixins.toolbar, // to avoid contents to show behide headr
  header: {
    fontSize: "1.15em",
    backgroundColor: theme.palette.header.backgroundColor,
    color: theme.palette.header.color,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  logo: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(2),
  },
  menuLink: {
    marginRight: theme.spacing(2),
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  menuLabel: {
    paddingLeft: theme.spacing(1.5),
  },
  headerLabel: {
  },
  title: { // TODO...
    flexGrow: 1,
    color: "#222",
    fontWeight: 700,
    fontSize: "1.5em",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerContainer: {
  },
  menuItem: {
    borderBottom: "1px solid #eaeaea",
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: "1.5vw",
    paddingBottom: "1.5vw",
  },
  menuPadding: {
    padding: 0,
    lineHeight: 0,
  },
}));

const elevation = 3; // header elevation over contents below



function Header() {
  const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(undefined);

  // handle auth
  useEffect(() => {
    const user = AuthService.getCurrentUser();
console.log("HEADER - CURRENT USER:", user);

    if (user) {
      setCurrentUser(user);
      //setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      //setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("login", () => {
      logIn();
    });
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  // handle responsiveness
  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < config.mobileDesktopWatershed
        ? setState((prevState) => ({ ...prevState, view: "mobile" }))
        : setState((prevState) => ({ ...prevState, view: "desktop" }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const logIn = () => {
console.log("HEADER LOGIN");
    //setShowModeratorBoard(false);
    //setShowAdminBoard(false);
    setCurrentUser(AuthService.getCurrentUser());
  };

  const logOut = () => {
console.log("HEADER LOGOUT");
    AuthService.logout();
    //setShowModeratorBoard(false);
    //setShowAdminBoard(false);
    setCurrentUser(undefined);
  };
  
  const [state, setState] = useState({
    view: "mobile", // mobile / desktop
    drawerOpen: false,
    userMenuIsOpen: false,
  });

  const handleDrawerOpen = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: true }));
  const handleDrawerClose = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: false }));

  const [anchorUserMenuEl, setAnchorUserMenuEl] = React.useState(null);
  const userMenuIsOpen = Boolean(anchorUserMenuEl);

  const handleUserMenuOpen = (event) => {
    setAnchorUserMenuEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorUserMenuEl(null);
  };
  
  const handleUserJoin = (event) => {
    history.push("/signin");
  };

  const mainItems = [
    {
      label: t("Home"),
      icon: <HomeIcon />,
      href: "/",
      showInDesktopMode: false,
    },
    // {
    //   label: t("Searches"),
    //   icon: <SearchIcon />,
    //   href: "/searches",
    // },
    // {
    //   label: t("Listings"),
    //   icon: <ListAltIcon />,
    //   href: "/listings",
    // },
    {
      label: t("Support"),
      icon: <ContactSupportIcon />,
      href: "/support",
    },
  ];

  // const userItems = auth.user ?
  const userItems = currentUser ?
    [
      {
        label: t("Profile"),
        icon: <AccountCircleIcon />,
        href: "/profile",
      },
      {
        label: t("Sign out"),
        icon: <ExitToAppIcon />,
        href: "/signout",
      },
    ] : [
      {
        label: t("Sign in"),
        icon: <VpnKeyIcon />,
        href: "/signin",
      },
      {
        label: t("Sign up"),
        icon: <AssignmentTurnedInIcon />,
        href: "/signup",
      },
    ]
  ;
  // if (auth.user && isAdmin(auth.user)) {
  (currentUser && isAdmin(currentUser)) &&
    userItems.unshift(
      {
        label: t("Admin panel"),
        icon: <SecurityIcon />,
        href: "/admin-panel",
      }
    );
  //};
 
  const getMobileMainMenuItems = () => {
    return mainItems.map(({ label, icon, href }) => (
      <Link {...{
        key: label,
        component: RouterLink,
        to: href,
        color: "inherit",
        className: classes.menuLink,
      }}>
        <MenuItem
          key={label}
          className={classes.menuItem}
        >
          <Grid container spacing={1} alignItems="center">
            {icon}
            <span className={classes.menuLabel}>{label}</span>
          </Grid>
        </MenuItem>
      </Link>
    ));
  };

  const getDesktopMainHeaderItems = () => {
    return mainItems.filter(item => item.showInDesktopMode !== false).map(({ label, icon, href }) => (
      <Link {...{
        key: label,
        component: RouterLink,
        to: href,
        color: "inherit",
        className: classes.menuLink,
      }}>
        <span className={classes.headerLabel}>{label}</span>
      </Link>
    ));
  };

  const getUserMenuItems = () => {
    return userItems.map(({ label, icon, href }) => (
        <Link {...{
          key: label,
          component: RouterLink,
          to: href,
          color: "inherit",
          className: classes.menuLink,
        }}>
          <MenuItem
            key={label}
            className={classes.menuItem}
          >
            <Grid container spacing={1} alignItems="center">
              {icon}
              <span className={classes.menuLabel}>{label}</span>
            </Grid>
          </MenuItem>
        </Link>
    ));
  };

  const showJoinButton = () => {
    return !["/signin", "/signup", "/signout"].includes(location.pathname);
  };

  //console.log('HEADER - auth:', auth);
  //console.log("LOCATION:", location);

  return (
    <header>
      <AppBar className={classes.header} elevation={elevation} position="fixed">
        <Toolbar variant="dense">

          {/* drawer button */}
          {state.view === "mobile" &&
            <IconButton {...{ // mobile only
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}>
              <MenuIcon />
            </IconButton>
          }

          {/* drawer menu */}
          {state.view === "mobile" &&
            <Drawer // mobile only
              anchor="left"
              open={state.drawerOpen}
              onClose={handleDrawerClose}
              onClick={handleDrawerClose} // to close on click everywhere
            >
              <div className={classes.drawerContainer}>{getMobileMainMenuItems()}</div>
            </Drawer>
          }

          {/* main brand logo icon */}
          <RouterLink to="/">
            <IconCustom name="LogoMain" size={30} className={classes.logo} />
          </RouterLink>

          {/* main brand logo text */}
          <div className={classes.title}>
            {config.appTitle}
          </div>

          {state.view === "desktop" &&
            <div>
              {getDesktopMainHeaderItems()}
            </div>
          }

          {/* user menu */}
          <>
          {currentUser ? 
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
            >
              {currentUser.profileImage ?
                <ImageCustom src={auth.user.profileImage} alt="user's icon" width={30} style={{borderRadius: "50%"}} />
              :
                <IconGravatar
                  // email={auth.user.email}
                  email={currentUser.email}
                  size={30}
                />
              }
            </IconButton>
          :
            showJoinButton() ?
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleUserJoin}
              >
                {t("Join !")}
              </Button>
            :
              null
          }
{/*
            {auth.user ?
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                {auth.user ?
                  auth.user.profileImage ?
                    <ImageCustom src={auth.user.profileImage} alt="user's icon" width={30} style={{borderRadius: "50%"}} />
                  :
                    <IconGravatar
                      email={auth.user.email}
                      size={30}
                    />
                :
                  <AccountCircleIcon />
                }
              </IconButton>
            :
              (auth.user === false) && // if auth.user is false, we show the "Join" button;
                                       // otherwise (it's null), we don't kow yet, so do not show anything...
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleUserJoin}
                >
                  {t("Join !")}
                </Button>
            }
*/}

            <Menu
              id="menu-appbar"
              anchorEl={anchorUserMenuEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={userMenuIsOpen}
              onClose={handleUserMenuClose}
              onClick={handleUserMenuClose} // to close on click everywhere
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              MenuListProps={{
                classes: { padding: classes.menuPadding }
              }}
            >
              {getUserMenuItems()}
            </Menu>
          </>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </header>
  );
}

export default React.memo(Header);