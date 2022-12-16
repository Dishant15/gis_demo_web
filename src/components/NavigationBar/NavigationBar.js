import React, { useCallback, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";

import { KeyboardArrowDown } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  getGeoSurveyPath,
  getHomePath,
  getLoginPath,
  getElementConfigPage,
  getPlanningPage,
  getRegionPage,
  getTicketListPage,
  getUserListPage,
  getUserRolePage,
  getFeedbackLink,
  getChangePasswordPage,
} from "utils/url.constants";

import {
  getIsAdminUser,
  getIsSuperAdminUser,
  getIsUserLoggedIn,
  getUserPermissions,
} from "redux/selectors/auth.selectors";
import { handleLogoutUser } from "redux/actions/auth.actions";
import LOGO from "assets/gtpl.jpeg";

import "./navigation-bar.scss";

const NavigationBar = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const isAdminUser = useSelector(getIsAdminUser);
  const isSuperAdminUser = useSelector(getIsSuperAdminUser);
  const permissions = useSelector(getUserPermissions);
  const isUserLoggedIn = useSelector(getIsUserLoggedIn);

  const canUserView = get(permissions, "user_view", false) || isSuperAdminUser;
  const canRegionView =
    get(permissions, "region_view", false) || isSuperAdminUser;
  const canTicketView =
    get(permissions, "ticket_view", false) || isSuperAdminUser;
  const canPlanningView =
    get(permissions, "planning_view", false) || isSuperAdminUser;
  const canSurveyView =
    get(permissions, "survey_view", false) || isSuperAdminUser;

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuName, setMenuName] = useState(null);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setMenuName(null);
  }, []);

  const handleClick = useCallback(
    (name) => (e) => {
      setAnchorEl(e.currentTarget);
      setMenuName(name);
    },
    []
  );

  const handleLogout = useCallback(() => {
    dispatch(handleLogoutUser);
    navigate(getLoginPath());
  }, []);

  const showAdminMenu = !!anchorEl && menuName === "administration-menu";
  const showSettingsMenu = !!anchorEl && menuName === "settings-menu";
  const showAdministration =
    isSuperAdminUser ||
    (isAdminUser && (canUserView || canRegionView || canTicketView));

  const menuContent = useMemo(() => {
    if (isUserLoggedIn) {
      return (
        <Stack direction="row" spacing={2}>
          <Button to={getHomePath()} component={Link} color="inherit">
            Home
          </Button>
          {canSurveyView ? (
            <Button component={Link} to={getGeoSurveyPath()} color="inherit">
              Survey
            </Button>
          ) : null}
          {canPlanningView ? (
            <Button component={Link} to={getPlanningPage()} color="inherit">
              Planning
            </Button>
          ) : null}
          {/* <Button component={Link} to={"#"} color="inherit">
            Analysis
          </Button> */}
          {showAdministration ? (
            <Button
              color="inherit"
              id="administration-button"
              onClick={handleClick("administration-menu")}
              aria-controls={showAdminMenu ? "administration-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={showAdminMenu ? "true" : undefined}
              endIcon={<KeyboardArrowDown />}
            >
              Administration
            </Button>
          ) : null}
          <Button
            color="inherit"
            id="settings-button"
            onClick={handleClick("settings-menu")}
            aria-controls={showSettingsMenu ? "settings-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={showSettingsMenu ? "true" : undefined}
            endIcon={<KeyboardArrowDown />}
          >
            Settings
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" spacing={2}>
          <Button to={getLoginPath()} component={Link} color="inherit">
            Login
          </Button>
        </Stack>
      );
    }
  }, [isUserLoggedIn, showAdministration, canPlanningView, canSurveyView]);

  return (
    <AppBar position="static" id="navigation-bar">
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <img src={LOGO} className="logo" />
        {menuContent}
        <Menu
          id="administration-menu"
          anchorEl={anchorEl}
          MenuListProps={{
            "aria-labelledby": "administration-button",
          }}
          open={showAdminMenu}
          onClose={handleClose}
        >
          {canRegionView ? (
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={getRegionPage()}
            >
              Region Management
            </MenuItem>
          ) : null}
          {canUserView ? (
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={getUserListPage()}
            >
              User Management
            </MenuItem>
          ) : null}
          {isSuperAdminUser ? (
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={getUserRolePage()}
            >
              Role Management
            </MenuItem>
          ) : null}
          {canTicketView ? (
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={getTicketListPage()}
            >
              Ticket Management
            </MenuItem>
          ) : null}
          {isSuperAdminUser ? (
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={getElementConfigPage()}
            >
              Element Configuration
            </MenuItem>
          ) : null}
          {isSuperAdminUser ? (
            <MenuItem
              onClick={handleClose}
              component="a"
              href={getFeedbackLink()}
              target="__blank"
            >
              Feedback
            </MenuItem>
          ) : null}
        </Menu>
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          MenuListProps={{
            "aria-labelledby": "settings-button",
          }}
          open={showSettingsMenu}
          onClose={handleClose}
        >
          <MenuItem
            onClick={handleClose}
            component={Link}
            to={getChangePasswordPage()}
          >
            Change Password
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
