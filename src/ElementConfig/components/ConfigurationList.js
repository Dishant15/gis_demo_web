import React from "react";

import { Container, Paper, Typography, Box } from "@mui/material";

/**
 * Parent:
 *    PlanningConfigurationPage
 */
const ConfigurationListWrapper = ({ layerKey }) => {
  // fetch list of config data
  // handle loading
  // handle add popup show / hide logic
  // handle edit popup show / hide logic

  return (
    <Container
      sx={{
        paddingTop: 3,
        paddingBottom: 3,
        height: "100%",
      }}
    >
      <Paper
        sx={{
          height: "100%",
        }}
      >
        {layerKey ? (
          <ConfigurationList configList={[]} />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h5">Please select config type</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

const ConfigurationList = ({ configList }) => {
  // render list of configurations

  return "list";
};

export default ConfigurationListWrapper;
