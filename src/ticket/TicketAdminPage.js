import React from "react";
import { Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

/**
 * Parent:
 *    App
 */
const TicketAdminPage = () => {
  return (
    <Container>
      <Paper sx={{ mt: 3 }}>
        <Outlet />
      </Paper>
    </Container>
  );
};

export default TicketAdminPage;
