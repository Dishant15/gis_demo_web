import { Box, Typography } from "@mui/material";
import React from "react";

/**
 * Show list on configurations
 * handle user click -> update config on redux
 *
 * Parent
 *  AddElementContent
 */
const ElementConfigPopup = ({ layerKey }) => {
  return (
    <Box>
      <Typography>{layerKey}</Typography>
    </Box>
  );
};

export default ElementConfigPopup;
