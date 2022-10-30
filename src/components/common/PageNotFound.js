import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Stack, Typography, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { getHomePath } from "utils/url.constants";

const PageNotFound = () => {
  const navigate = useNavigate();
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
          Look like this page is not belong to our website
        </Typography>
      </Stack>
      <Stack flexDirection="row" py={4} px={2}>
        <LoadingButton
          variant="outlined"
          startIcon={<ArrowBackIosIcon />}
          onClick={() => navigate(-1)}
          sx={{ margin: 1 }}
          color="secondary"
        >
          Go Back
        </LoadingButton>
        <LoadingButton
          component={Link}
          to={getHomePath()}
          variant="outlined"
          endIcon={<ArrowForwardIosIcon />}
          sx={{ margin: 1 }}
          color="success"
        >
          Go to Home
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default PageNotFound;
