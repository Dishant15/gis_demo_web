import React from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "react-query";

import NavigationBar from "components/NavigationBar";
import Notification from "components/common/Notification";
import WaterMark from "components/common/WaterMark";

import { fetchHealthCheck } from "./services";

const Layout = () => {
  // once user is logged in check his token status and update last login
  const { data: healthCheckData } = useQuery("healthCheck", fetchHealthCheck, {
    staleTime: 5 * 60000, // 5 minutes
  });

  return (
    <div id="layout">
      <NavigationBar />
      <Outlet />
      <Notification />
      <WaterMark />
    </div>
  );
};

export default Layout;
