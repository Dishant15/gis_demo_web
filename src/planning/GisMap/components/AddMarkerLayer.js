import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DrawingManager } from "@react-google-maps/api";

import { Button, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import { getMarkerCoordinatesFromFeature } from "utils/map.utils";
import {
  setMapState,
  updateMapStateData,
} from "planning/data/planningGis.reducer";

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
        <Typography variant="h6">{helpText}</Typography>
        <Stack>
          <Button disabled={isAdd} onClick={handleAddComplete}>
            Submit
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Stack>
      </GisMapPopups>
    </>
  );
};

export default AddMarkerLayer;
