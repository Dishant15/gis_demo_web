import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container, Paper } from "@mui/material";

import { getContentHeight } from "redux/selectors/appState.selectors";

/**
 * Parent:
 *    App
 */
const TicketAdminPage = () => {
  const contentHeight = useSelector(getContentHeight);

  return (
    <Container sx={{ height: contentHeight, py: 2 }}>
      <Paper sx={{ height: "100%" }}>
        <Outlet />
      </Paper>
    </Container>
  );
};

export default TicketAdminPage;
