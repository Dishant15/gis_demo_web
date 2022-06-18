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
import Map from "components/common/Map";

import { getTicketListPage } from "utils/url.constants";
import { getCoordinatesFromFeature, latLongMapToCoords } from "utils/map.utils";
import { addNewTicket } from "ticket/data/services";
import { addNotification } from "redux/reducers/notification.reducer";

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
      <Map>
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
      </Map>
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
