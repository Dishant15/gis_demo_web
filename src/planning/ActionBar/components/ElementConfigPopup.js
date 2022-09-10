import React from "react";
import { Box, Typography, Stack, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Show list on configurations
 * handle user click -> update config on redux
 *
 * Parent
 *  AddElementContent
 */
const ElementConfigPopup = ({ layerKey }) => {
  return (
    <Box
      p={3}
      component="form"
      sx={{
        paddingTop: "10px",
      }}
    >
      <Stack direction="row" spacing={2} width="100%" alignItems="center">
        <Typography variant="h6" color="primary.dark" flex={1}>
          {layerKey} list
        </Typography>
        <IconButton aria-label="close">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider
        flexItem
        sx={{
          marginTop: "4px",
          marginBottom: "16px",
        }}
      />
      <Stack spacing={2}>
        <Typography>{layerKey}</Typography>
      </Stack>
    </Box>
  );
};

export default ElementConfigPopup;
