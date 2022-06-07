import { Container, Paper } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Parent:
 *    App
 */
const UserAdminPage = () => {
  return (
    <Container>
      <Paper sx={{ mt: 3 }}>
        <Outlet />
      </Paper>
    </Container>
  );
};

export default UserAdminPage;
