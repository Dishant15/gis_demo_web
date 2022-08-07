import React from "react";
import { Stack, Typography } from "@mui/material";

export default function PermissionNotFound() {
  return (
    <Stack height="100%" justifyContent="center" alignItems="center">
      <Typography variant="h4" color="primary">
        You don't have permission to access this page.
      </Typography>
    </Stack>
  );
}
