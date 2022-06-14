import React, { useCallback, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Box, Stack } from "@mui/material";
import { Done } from "@mui/icons-material";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
} from "@react-google-maps/api";
import LoadingButton from "@mui/lab/LoadingButton";

import { getTicketListPage } from "utils/url.constants";
import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";
import {
  getCoordinatesFromFeature,
  DEFAULT_MAP_CENTER,
  latLongMapToCoords,
} from "utils/map.utils";
import { addNewTicket } from "ticket/data/services";
import { addNotification } from "redux/reducers/notification.reducer";

const containerStyle = {
  width: "100%",
  height: "100%",
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
  const dispatch = useDispatch();

  const polyRef = useRef();
  const [isDrawing, setIsDrawing] = useState(true);

  const { regionCoords } = formData;

  const { mutate, isLoading: isTicketAdding } = useMutation(addNewTicket, {
    onSuccess: (res) => {
      navigate(getTicketListPage());
      dispatch(
        addNotification({
          type: "success",
          title: "New Ticket created.",
        })
      );
    },
    onError: (err) => {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          text: err.message,
        })
      );
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
    <Box sx={{ flex: 1, position: "relative" }}>
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
      <Stack
        sx={{
          position: "absolute",
          bottom: "1em",
          right: "3.4em",
        }}
      >
        <LoadingButton
          variant="contained"
          loading={isTicketAdding}
          onClick={handleSubmit}
          startIcon={<Done />}
        >
          Complete
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default TicketMap;
