import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

import noop from "lodash/noop";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_LIBRARIES,
} from "./map.constants";

const DEFAULT_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
};

/**
 *
 */
const GoogleMapWrapper = ({
  children,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  containerStyle = DEFAULT_CONTAINER_STYLE,
  onClick = noop,
  ...restMapProps
}) => {
  return (
    <LoadScript
      libraries={MAP_LIBRARIES}
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      loadingElement={
        <Box p={5} display="flex">
          <Skeleton height="400px" width="100%" sx={{ transform: "unset" }} />
        </Box>
      }
    >
      <GoogleMap
        {...restMapProps}
        clickableIcons={false}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={onClick}
        options={(maps) => {
          return {
            zoomControl: true,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            mapTypeControl: true,
            mapTypeId: maps.MapTypeId.SATELLITE,
            mapTypeControlOptions: {
              style: maps.MapTypeControlStyle.DEFAULT,
              position: maps.ControlPosition.BOTTOM_CENTER,
              mapTypeIds: [
                maps.MapTypeId.ROADMAP,
                maps.MapTypeId.SATELLITE,
                maps.MapTypeId.HYBRID,
              ],
            },
          };
        }}
      >
        {children}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapWrapper;
