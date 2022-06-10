import React, { useCallback, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { Box, Button, Stack } from "@mui/material";
import { Done } from "@mui/icons-material";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

import { getTicketListPage } from "utils/url.constants";
import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";
import {
  getCoordinatesFromFeature,
  DEFAULT_MAP_CENTER,
  latLongMapToCoords,
  coordsToLatLongMap,
} from "utils/map.utils";
import { editTicketArea } from "ticket/data/services";

const containerStyle = {
  width: "100%",
  minHeight: "100vh",
};

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
  const navigate = useNavigate();
  const polyRef = useRef();

  const { region, area_pocket } = ticketData;

  const { mutate: editTicket, isLoading: isTicketAdding } = useMutation(
    editTicketArea,
    {
      onSuccess: (res) => {
        navigate(getTicketListPage());
      },
      onError: (err) => {
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
              clickable: false,
              draggable: true,
              editable: true,
              geodesic: false,
              zIndex: 3,
            }}
            onLoad={onPolygonLoad}
            paths={coordsToLatLongMap(area_pocket.coordinates)}
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

export default TicketEditMap;
