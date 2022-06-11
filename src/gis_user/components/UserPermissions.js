import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const UserPermissions = ({ onSubmit, goBack }) => {
  return (
    <Box>
      <Typography variant="h4">User Permissiosn Form</Typography>
      <Stack flex={1} p={4} direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          color="error"
          startIcon={<ArrowBackIosIcon />}
          onClick={goBack}
        >
          Back
        </Button>
        <LoadingButton
          variant="contained"
          color="success"
          type="submit"
          endIcon={<ArrowForwardIosIcon />}
          onClick={onSubmit}
        >
          Next
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default UserPermissions;
