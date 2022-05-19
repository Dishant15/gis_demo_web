import React from "react";
import { Outlet, Link } from "react-router-dom";

import Container from "@mui/material/Container";
import NavigationBar from "../components/NavigationBar";

const Layout = () => {
  return (
    <div id="layout">
      <NavigationBar />
      <Outlet />
    </div>
  );
};

export default Layout;
