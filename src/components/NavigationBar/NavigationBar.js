import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  getAreaPocketPath,
  getHomePath,
  getLoginPath,
} from "../../utils/url.constants";
import { useDispatch } from "react-redux";

import "./navigation-bar.scss";
import { logout } from "../../redux/reducers/auth.reducer";

const NavigationBar = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(getLoginPath());
  }, []);

  const open = !!anchorEl;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Network GIS
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button to={getHomePath()} component={Link} color="inherit">
            Home
          </Button>
          <Button component={Link} to={"#"} color="inherit">
            Survey
          </Button>
          <Button component={Link} to={"#"} color="inherit">
            Planning
          </Button>
          <Button component={Link} to={"#"} color="inherit">
            Analysis
          </Button>
          <Button
            color="inherit"
            id="administration-button"
            onClick={handleClick}
            aria-controls={open ? "administration-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            endIcon={<KeyboardArrowDown />}
          >
            Administration
          </Button>
        </Stack>
        <Menu
          id="administration-menu"
          anchorEl={anchorEl}
          MenuListProps={{
            "aria-labelledby": "administration-button",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={handleClose}
            component={Link}
            to={getAreaPocketPath()}
          >
            Area Pocket
          </MenuItem>
          <MenuItem>Users & Permissions</MenuItem>
          <MenuItem>Network</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
