import React from "react";

import { Box, Paper, Portal } from "@mui/material";

const GisMapPopups = ({ children }) => {
  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          right: "10%",
          maxWidth: "550px",
        }}
      >
        <Paper elevation={3}>{children}</Paper>
      </Box>
    </Portal>
  );
};

export default GisMapPopups;
