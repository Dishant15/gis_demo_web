import React from "react";

import { Container, Paper, Typography, Box } from "@mui/material";

/**
 * Parent:
 *    PlanningConfigurationPage
 */
const ConfigurationListWrapper = (props) => {
  const { layerkey } = props;
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
        {layerkey ? (
          <ConfigurationList layerkey={layerkey} />
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

const ConfigurationList = ({ layerkey }) => {
  return "list";
};

export default ConfigurationListWrapper;
