import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DrawingManager } from "@react-google-maps/api";

import { lineString, length } from "@turf/turf";
import round from "lodash/round";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import { setMapState } from "planning/data/planningGis.reducer";
import {
  getCoordinatesFromFeature,
  latLongMapToLineCoords,
} from "utils/map.utils";

const AddPolyLineLayer = ({ options, helpText, nextEvent = {} }) => {
  const dispatch = useDispatch();
  const featureRef = useRef();
  // once user adds marker go in edit mode
  const [isAdd, setIsAdd] = useState(true);

  const handleFeatureCreate = useCallback((feature) => {
    featureRef.current = feature;
    setIsAdd(false);
  }, []);

  const handleAddComplete = useCallback(() => {
    const featureCoords = getCoordinatesFromFeature(featureRef.current);
    // set coords to form data
    const coordinates = latLongMapToLineCoords(featureCoords);
    // get length and round to 4 decimals
    const gis_len = round(length(lineString(coordinates)), 4);

    nextEvent.data = {
      ...nextEvent.data,
      geometry: coordinates,
      // get gis_len
      gis_len,
    };
    // clear map refs
    featureRef.current.setMap(null);
    // complete current event -> fire next event
    dispatch(setMapState(nextEvent));
  }, []);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
    featureRef.current.setMap(null);
  }, []);

  return (
    <>
      <DrawingManager
        options={{
          drawingControl: false,
          polylineOptions: { ...options, editable: true },
        }}
        drawingMode={isAdd ? "polyline" : null}
        onPolylineComplete={handleFeatureCreate}
      />
      <GisMapPopups>
        <Paper>
          <Box
            minWidth="350px"
            maxWidth="550px"
            backgroundColor="secondary.light"
            p={2}
          >
            <Typography color="background.paper" mb={2} variant="h6">
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

export default AddPolyLineLayer;
