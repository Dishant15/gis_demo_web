import React, { useCallback, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { polygon, booleanContains } from "@turf/turf";
import { Polygon, DrawingManager } from "@react-google-maps/api";

import get from "lodash/get";

import { Box, Button, Typography, Skeleton } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Done } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";

import Map from "components/common/Map";

import { getTicketListPage } from "utils/url.constants";
import {
  coordsToLatLongMap,
  getCoordinatesFromFeature,
  latLongMapToCoords,
} from "utils/map.utils";
import { addNewTicket } from "ticket/data/services";
import { addNotification } from "redux/reducers/notification.reducer";
import { fetchRegionDetails } from "region/data/services";

/**
 * fetch region details based on formData.regionId before load map
 *
 * Parent
 *  TicketAddForm
 * Render
 *  TicketMap
 */

const TicketMapWrapper = ({ formData }) => {
  const { isLoading, data } = useQuery(
    ["regionDetails", formData.regionId],
    fetchRegionDetails
  );

  const coordinates = get(data, "coordinates") || [];
  const center = get(data, "center") || [0, 0];

  if (isLoading) return <Skeleton animation="wave" height="30rem" />;

  return (
    <TicketMap
      formData={{
        ...formData,
        regionCoords: coordsToLatLongMap(coordinates, true),
        regionCenter: coordsToLatLongMap([center])[0],
      }}
    />
  );
};

/**
 * Show map to draw AreaPocket for ticket
 * Map shows selected region boundary
 * Opens in Drawing mode and user can edit after completing polygon
 *
 * formData shape :- Ticket Details field, regionCoords
 *
 * Parent
 *  TicketMapWrapper
 */
const TicketMap = ({ formData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const polyRef = useRef();
  const [isDrawing, setIsDrawing] = useState(true);

  const { regionCoords, regionCenter } = formData;

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
    const regCoords = formData.regionCoords;
    let coordinates = getCoordinatesFromFeature(polyRef.current);
    coordinates = latLongMapToCoords(coordinates);
    // check if coordinates are valid
    const areaPoly = polygon([coordinates]);

    for (let regInd = 0; regInd < regCoords.length; regInd++) {
      const currRegion = regCoords[regInd];

      const regionPoly = polygon([latLongMapToCoords(currRegion)]);

      if (booleanContains(regionPoly, areaPoly)) {
        // area inside one of the polygons
        mutate({
          ...formData,
          // remove region coordinates
          regionCoords: undefined,
          coordinates,
        });
        return;
      }
    }

    // none of the polygons contains this area
    dispatch(
      addNotification({
        type: "error",
        title: "Input Error",
        text: "Ticket work area must be inside ticket region",
      })
    );
  }, [mutate, formData]);

  const onPolygonComplete = useCallback((polygon) => {
    polyRef.current = polygon;
    setIsDrawing(false);
  }, []);

  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <div className="reg-map-details">
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Draw a Polygon
            </Typography>
            <Typography variant="body2">
              Click on the map to place points of the polygon
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
              variant="contained"
              loading={isTicketAdding}
              onClick={handleSubmit}
              startIcon={<Done />}
              size="small"
            >
              Complete
            </LoadingButton>
          </CardActions>
        </Card>
      </div>
      <Map center={regionCenter}>
        <DrawingManager
          options={{
            drawingControl: false,
            polygonOptions: {
              fillColor: "lightblue",
              fillOpacity: 0.5,
              strokeColor: "blue",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: true,
              draggable: true,
              editable: true,
              geodesic: false,
              zIndex: 2,
            },
          }}
          drawingMode={isDrawing ? "polygon" : null}
          onPolygonComplete={onPolygonComplete}
        />
        {regionCoords.map((regPolyCoords, regInd) => {
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
              paths={regPolyCoords}
            />
          );
        })}
      </Map>
    </Box>
  );
};

export default TicketMapWrapper;
