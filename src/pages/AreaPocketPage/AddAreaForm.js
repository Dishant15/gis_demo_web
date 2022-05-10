import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const AddAreaForm = () => {
  return (
    <Paper elevation={5}>
      <Box
        p={3}
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <Typography variant="h5">Add Area Form</Typography>
      </Box>
    </Paper>
  );
};

export default AddAreaForm;
