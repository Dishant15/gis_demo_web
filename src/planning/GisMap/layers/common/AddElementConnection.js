import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Divider,
  Stack,
  Typography,
  Skeleton,
  Chip,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";

const AddElementConnection = () => {
  const dispatch = useDispatch();
  const { elementId, layerKey, elementList, existingConnections } = useSelector(
    getPlanningMapStateData
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  // loop over possible connections
  // check if same layer_key, id data in existingConnections
  // if true than disable connect btn

  const handleConnect = useCallback(() => {
    // required data = cable id, cable end
    // element id, element layer key
  }, []);

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        {/* header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          p={1}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            Add Connection
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
    </GisMapPopups>
  );
};

export default AddElementConnection;
