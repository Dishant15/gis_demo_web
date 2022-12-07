import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container, Paper } from "@mui/material";

import PermissionNotFound from "components/common/PermissionNotFound";

import {
  checkUserPermission,
  getIsAdminUser,
  getIsSuperAdminUser,
} from "redux/selectors/auth.selectors";

/**
 * Parent:
 *    App
 */
const UserAdminPage = () => {
  const canUserView = useSelector(checkUserPermission("user_view"));
  const isAdminUser = useSelector(getIsAdminUser);
  const isSuperAdminUser = useSelector(getIsSuperAdminUser);

  const canView = canUserView || isAdminUser || isSuperAdminUser;

  if (canView) {
    return (
      <Container>
        <Paper sx={{ mt: 3 }}>
          <Outlet />
        </Paper>
      </Container>
    );
  } else {
    return (
      <Container>
        <Paper
          sx={{
            mt: 3,
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PermissionNotFound />
        </Paper>
      </Container>
    );
  }
};

export default UserAdminPage;
