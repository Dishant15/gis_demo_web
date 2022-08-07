import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container, Paper } from "@mui/material";

import PermissionNotFound from "components/common/PermissionNotFound";

import { checkUserPermission } from "redux/selectors/auth.selectors";

/**
 * Parent:
 *    App
 */
const UserAdminPage = () => {
  const canUserView = useSelector(checkUserPermission("user_view"));

  return (
    <Container>
      <Paper sx={{ mt: 3 }}>
        {canUserView ? <Outlet /> : <PermissionNotFound />}
      </Paper>
    </Container>
  );
};

export default UserAdminPage;
