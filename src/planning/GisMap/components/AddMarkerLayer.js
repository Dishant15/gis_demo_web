import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DrawingManager } from "@react-google-maps/api";

import { Button, Paper, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import { getMarkerCoordinatesFromFeature } from "utils/map.utils";
import {
  setMapState,
  updateMapStateData,
} from "planning/data/planningGis.reducer";
import { Box } from "@mui/system";

const AddMarkerLayer = ({ icon, helpText, nextEvent = {} }) => {
  const dispatch = useDispatch();
  const markerRef = useRef();
  // once user adds marker go in edit mode
  const [isAdd, setIsAdd] = useState(true);

  const handleMarkerCreate = useCallback((marker) => {
    markerRef.current = marker;
    setIsAdd(false);
  }, []);

  const handleAddComplete = useCallback(() => {
    const markerCoords = getMarkerCoordinatesFromFeature(markerRef.current);
    // set marker coords to form data
    nextEvent.data = {
      ...nextEvent.data,
      coordinates: markerCoords,
    };
    // clear map refs
    markerRef.current.setMap(null);
    // complete current event -> fire next event
    dispatch(setMapState(nextEvent));
  }, []);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
    markerRef.current.setMap(null);
  }, []);

  return (
    <>
      <DrawingManager
        options={{
          drawingControl: false,
          markerOptions: {
            icon,
            clickable: true,
            draggable: true,
            editable: true,
            geodesic: false,
            zIndex: 10,
          },
        }}
        drawingMode={isAdd ? "marker" : null}
        onMarkerComplete={handleMarkerCreate}
      />
      <GisMapPopups>
        <Paper>
          <Box sx={{ backgroundColor: "secondary.light" }} p={2}>
            <Typography color="background.default" mb={2} variant="h6">
              {helpText}
            </Typography>
            <Stack spacing={2} direction="row">
              <Button
                sx={{ minWidth: "10em" }}
                disableElevation
                variant="contained"
                disabled={isAdd}
                onClick={handleAddComplete}
              >
                Submit
              </Button>
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
    </>
  );
};

export default AddMarkerLayer;
