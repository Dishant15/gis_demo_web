import React, { useCallback, useRef } from "react";
import { useMutation } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { polygon, booleanContains } from "@turf/turf";

import get from "lodash/get";

import { Box, Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
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
  const regionCoordinates = coordsToLatLongMap(region.coordinates, true);
  const regionCenter = coordsToLatLongMap([get(region, "center", [0, 0])])[0];

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
    let coordinates = getCoordinatesFromFeature(polyRef.current);
    coordinates = latLongMapToCoords(coordinates);
    // check if coordinates are valid
    const areaPoly = polygon([coordinates]);

    for (
      let regPolyInd = 0;
      regPolyInd < region.coordinates.length;
      regPolyInd++
    ) {
      const regionPoly = polygon([region.coordinates[regPolyInd]]);

      if (booleanContains(regionPoly, areaPoly)) {
        editTicket({
          ticketId: ticketData.id,
          data: { coordinates },
        });
        return;
      }
    }
    dispatch(
      addNotification({
        type: "error",
        title: "Input Error",
        text: "Ticket work area must be inside ticket region",
      })
    );
  }, [editTicket, ticketData.id, region.coordinates]);

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
      <div className="reg-map-details">
        <Card sx={{ maxWidth: 345 }} elevation={3}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Finalise work area polygon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click and drag points on polygon edges to fine tune polygon shape
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              sx={{ marginRight: "8px" }}
              component={Link}
              to={getTicketListPage()}
              variant="contained"
              disableElevation
              color="error"
              size="small"
            >
              Cancel
            </Button>
            <LoadingButton
              disableElevation
              size="small"
              variant="contained"
              loading={isTicketAdding}
              onClick={handleSubmit}
              startIcon={<Done />}
            >
              Complete
            </LoadingButton>
          </CardActions>
        </Card>
      </div>
      <Map center={regionCenter}>
        {regionCoordinates.map((currRegion, regInd) => {
          return (
            <Polygon
              key={regInd}
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
              paths={currRegion}
            />
          );
        })}
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
    </Box>
  );
};

export default TicketEditMap;
