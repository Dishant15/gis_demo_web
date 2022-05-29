import React from "react";
import { Outlet } from "react-router-dom";

import NavigationBar from "components/NavigationBar";

const Layout = () => {
  return (
    <div id="layout">
      <NavigationBar />
      <Outlet />
    </div>
  );
};

export default Layout;
