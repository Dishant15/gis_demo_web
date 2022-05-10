import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import {
  getAreaPocketPath,
  getGeoSurveyPath,
  getHomePath,
} from "../../utils/url.constants";

import "./navigation-bar.scss";

const NavigationBar = () => {
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
          <Button component={Link} to={getAreaPocketPath()} color="inherit">
            Area Pockets
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
