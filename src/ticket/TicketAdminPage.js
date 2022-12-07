import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container, Paper } from "@mui/material";
import PermissionNotFound from "components/common/PermissionNotFound";

import { getContentHeight } from "redux/selectors/appState.selectors";
import { checkUserPermission } from "redux/selectors/auth.selectors";

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
