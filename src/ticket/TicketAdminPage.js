import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container, Paper } from "@mui/material";

import { getContentHeight } from "redux/selectors/appState.selectors";
import { checkUserPermission } from "redux/selectors/auth.selectors";
import PermissionNotFound from "components/common/PermissionNotFound";

/**
 * Parent:
 *    App
 */
const TicketAdminPage = () => {
  const contentHeight = useSelector(getContentHeight);
  const canTicketView = useSelector(checkUserPermission("ticket_view"));

  return (
    <Container sx={{ height: contentHeight, py: 2 }}>
      <Paper sx={{ height: "100%" }}>
        {canTicketView ? <Outlet /> : <PermissionNotFound />}
      </Paper>
    </Container>
  );
};

export default TicketAdminPage;
