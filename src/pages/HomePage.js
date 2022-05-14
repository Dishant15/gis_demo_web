import React from "react";
import { Box, Typography } from "@mui/material";

import image from "../assets/under_construction.svg";

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
      <div style={{ textAlign: "center", width: "100%" }}>
        <img
          style={{
            width: "500px",
            maxWidth: "40%",
          }}
          src={image}
        />
        <Typography variant="h5">Under Construction</Typography>
      </div>
    </Box>
  );
}
