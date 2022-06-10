import React from "react";
import { Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

/**
 * Parent:
 *    App
 */
const TicketAdminPage = () => {
  return (
    <Container sx={{ height: "100%" }}>
      <Paper sx={{ mt: 3, height: "100%" }}>
        <Outlet />
      </Paper>
    </Container>
  );
};

export default TicketAdminPage;
