import React from "react";

import { Box, Portal } from "@mui/material";

const GisMapPopups = ({ children }) => {
  return (
    <Portal>
      <Box
        sx={{
          backgroundColor: "background.default",
          position: "fixed",
          top: "10%",
          right: "10%",
          minWidth: "250px",
        }}
      >
        {children}
      </Box>
    </Portal>
  );
};

export default GisMapPopups;
