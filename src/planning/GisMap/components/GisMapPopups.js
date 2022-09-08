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
          minWidth: "250px",
        }}
      >
        <Paper>{children}</Paper>
      </Box>
    </Portal>
  );
};

export default GisMapPopups;
