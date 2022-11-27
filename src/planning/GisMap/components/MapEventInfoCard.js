import React, { useCallback } from "react";
import { setMapState } from "planning/data/planningGis.reducer";
import { useDispatch } from "react-redux";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import { DRAG_ICON_WIDTH } from "utils/constant";

const MapEventInfoCard = ({ helpText }) => {
  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
  }, []);

  return (
    <GisMapPopups dragId="MapEventInfoCard">
      <Paper>
        <Box
          minWidth="350px"
          maxWidth="550px"
          backgroundColor="secondary.light"
          p={2}
        >
          <Typography
            color="background.paper"
            mb={2}
            variant="h6"
            pl={`${DRAG_ICON_WIDTH - 16}px`}
          >
            {helpText}
          </Typography>
          <Stack spacing={2} direction="row">
            <Button
              color="error"
              sx={{ minWidth: "10em" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Paper>
    </GisMapPopups>
  );
};

export default MapEventInfoCard;
