import React from "react";
import { Box, Typography } from "@mui/material";

import DashTaskList from "../user_task/DashTaskList";

export default function HomePage() {
  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <DashTaskList />
    </Box>
  );
}
