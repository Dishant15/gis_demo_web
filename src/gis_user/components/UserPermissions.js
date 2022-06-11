import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Image from "assets/under_construction.svg";

const UserPermissions = ({ onSubmit, goBack }) => {
  return (
    <Box>
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
            src={Image}
          />
          <Typography variant="h5">Coming Soon</Typography>
        </div>
      </Box>
      <Stack flex={1} p={4} direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          color="error"
          startIcon={<ArrowBackIosIcon />}
          onClick={goBack}
        >
          Back
        </Button>
        <LoadingButton
          variant="outlined"
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
