import React, { useCallback, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { Box, Button, Stack } from "@mui/material";
import { Done } from "@mui/icons-material";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
} from "@react-google-maps/api";

import { getTicketListPage } from "utils/url.constants";
import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";
import {
  getCoordinatesFromFeature,
  DEFAULT_MAP_CENTER,
  latLongMapToCoords,
} from "utils/map.utils";
import { addNewTicket } from "ticket/data/services";

const containerStyle = {
  width: "100%",
  minHeight: "100vh",
};

/**
 * Show map to draw AreaPocket for ticket
 * Map shows selected region boundary
 * Opens in Drawing mode and user can edit after completing polygon
 *
 * formData shape :- Ticket Details field, regionCoords
 *
 * Parent
 *  TicketAddForm
 */
const TicketMap = ({ formData }) => {
  const navigate = useNavigate();
  const polyRef = useRef();
  const [isDrawing, setIsDrawing] = useState(true);

  const { regionCoords } = formData;

  const { mutate, isLoading: isTicketAdding } = useMutation(addNewTicket, {
    onSuccess: (res) => {
      navigate(getTicketListPage());
    },
    onError: (err) => {
      console.log("🚀 ~ file: TicketMap.js ~ line 10 ~ TicketMap ~ err", err);
    },
  });

  const handleSubmit = useCallback(() => {
    const coordinates = getCoordinatesFromFeature(polyRef.current);
    mutate({
      ...formData,
      // remove region coordinates
      regionCoords: undefined,
      coordinates: latLongMapToCoords(coordinates),
    });
  }, [mutate, formData]);

  const onPolygonComplete = useCallback((polygon) => {
    polyRef.current = polygon;
    setIsDrawing(false);
  }, []);

  return (
    <Box>
      <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          center={DEFAULT_MAP_CENTER}
          zoom={12}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false,
          }}
        >
          <DrawingManager
            options={{
              drawingControl: false,
              polygonOptions: {
                fillColor: "lightblue",
                fillOpacity: 0.5,
                strokeColor: "blue",
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: true,
                geodesic: false,
                zIndex: 2,
              },
            }}
            drawingMode={isDrawing ? "polygon" : null}
            onPolygonComplete={onPolygonComplete}
          />
          <Polygon
            options={{
              fillColor: "black",
              fillOpacity: 0.1,
              strokeColor: "black",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: false,
              draggable: false,
              editable: false,
              geodesic: false,
              zIndex: 1,
            }}
            paths={regionCoords}
          />
        </GoogleMap>
      </LoadScript>

      <Stack>
        {isTicketAdding ? (
          <Button>Loading...</Button>
        ) : (
          <Button onClick={handleSubmit} startIcon={<Done />}>
            Complete
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default TicketMap;
