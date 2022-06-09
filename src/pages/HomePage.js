import React from "react";
import { Box, Typography } from "@mui/material";

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
      <Typography variant="h1">There was A dashboard here !!</Typography>
    </Box>
  );
}
