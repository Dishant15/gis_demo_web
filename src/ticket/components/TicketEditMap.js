import React, { useCallback, useRef } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Box, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Done } from "@mui/icons-material";
import { Polygon } from "@react-google-maps/api";
import Map from "components/common/Map";

import { getTicketListPage } from "utils/url.constants";
import {
  getCoordinatesFromFeature,
  latLongMapToCoords,
  coordsToLatLongMap,
} from "utils/map.utils";
import { editTicketArea } from "ticket/data/services";
import { addNotification } from "redux/reducers/notification.reducer";

/**
 * Show area pocket of ticket
 * Open area pocket in edit mode
 * submit updated data to server
 *
 * ticketData shape :- Ticket Details field, regionCoords
 *
 * Parent
 *  TicketAddForm
 */
const TicketEditMap = ({ ticketData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const polyRef = useRef();

  const { region, area_pocket } = ticketData;

  const { mutate: editTicket, isLoading: isTicketAdding } = useMutation(
    editTicketArea,
    {
      onSuccess: (res) => {
        navigate(getTicketListPage());
        dispatch(
          addNotification({
            type: "success",
            title: "Ticket update",
            text: "Coordinates updated successfully",
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
        console.log(
          "🚀 ~ file: TicketEditMap.js ~ line 10 ~ TicketEditMap ~ err",
          err
        );
      },
    }
  );

  const handleSubmit = useCallback(() => {
    const coordinates = getCoordinatesFromFeature(polyRef.current);
    editTicket({
      ticketId: ticketData.id,
      data: { coordinates: latLongMapToCoords(coordinates) },
    });
  }, [editTicket, ticketData.id]);

  const onPolygonLoad = useCallback((polygon) => {
    polyRef.current = polygon;
  }, []);

  return (
    <Box
      p={0}
      height="100%"
      sx={{
        position: "relative",
      }}
    >
      <Map>
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
          paths={coordsToLatLongMap(region.coordinates)}
        />
        <Polygon
          options={{
            fillColor: "blue",
            fillOpacity: 0.2,
            strokeColor: "blue",
            strokeOpacity: 1,
            strokeWeight: 2,
            clickable: true,
            draggable: true,
            editable: true,
            geodesic: false,
            zIndex: 3,
          }}
          onLoad={onPolygonLoad}
          paths={coordsToLatLongMap(area_pocket.coordinates)}
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

export default TicketEditMap;
