import React, { useCallback, useRef, useState } from "react";
import { DrawingManager } from "@react-google-maps/api";

import { Box, Button, Portal, Stack, Typography } from "@mui/material";
import { getMarkerCoordinatesFromFeature } from "utils/map.utils";

const AddMarkerLayer = ({ icon, helpText }) => {
  const markerRef = useRef();
  // once user adds marker go in edit mode
  const [isAdd, setIsAdd] = useState(true);

  const handleMarkerCreate = useCallback((marker) => {
    markerRef.current = marker;
    setIsAdd(false);
  }, []);

  const handleAddComplete = useCallback(() => {
    const markerCoords = getMarkerCoordinatesFromFeature(markerRef.current);
    console.log(
      "🚀 ~ file: AddMarkerLayer.js ~ line 20 ~ handleAddComplete ~ markerCoords",
      markerCoords
    );
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
      <Portal>
        <Box
          sx={{
            backgroundColor: "background.default",
            position: "fixed",
            top: "10%",
            right: "10%",
            minWidth: "250px",
          }}
        >
          <Typography variant="h6">{helpText}</Typography>
          <Stack>
            <Button onClick={handleAddComplete}>Submit</Button>
            <Button>Cancel</Button>
          </Stack>
        </Box>
      </Portal>
    </>
  );
};

export default AddMarkerLayer;
