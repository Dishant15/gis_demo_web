import React from "react";
import { Link } from "react-router-dom";

import { Stack, Typography, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import HomeIcon from "@mui/icons-material/Home";

import { getHomePath } from "utils/url.constants";

const PageNotFound = () => {
  return (
    <Box
      height="100%"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Stack>
        <Typography
          sx={{
            fontSize: "15em",
          }}
          color="primary"
          textAlign="center"
        >
          404
        </Typography>
        <Typography variant="h4" textAlign="center">
          Page not found ! Looks like you have gone to an incorrect link.
        </Typography>
      </Stack>
      <Stack py={4} px={2}>
        <LoadingButton
          component={Link}
          to={getHomePath()}
          variant="outlined"
          startIcon={<HomeIcon />}
          color="secondary"
        >
          Go to Home
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default PageNotFound;
