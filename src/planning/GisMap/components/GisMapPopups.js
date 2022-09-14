import React from "react";

import { Box, Paper, Portal } from "@mui/material";

/**
 * Wrapper around any popup shown on PlanningPage over GisMap
 * handles positioning
 * children have to handle height / width cap
 *
 * Children
 *  ElementDetailsTable
 *  DynamicForm
 *  Paper popups on map add / edit events
 */
const GisMapPopups = ({ children }) => {
  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          right: "10%",
        }}
      >
        <Paper elevation={3}>{children}</Paper>
      </Box>
    </Portal>
  );
};

export default GisMapPopups;
