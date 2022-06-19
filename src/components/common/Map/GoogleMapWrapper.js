import React, { useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "./map.constants";

const DEFAULT_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
};

// Ahmedabad city center
export const DEFAULT_MAP_CENTER = { lat: 23.033863, lng: 72.585022 };
export const DEFAULT_MAP_ZOOM = 12;

/**
 *
 */
const GoogleMapWrapper = ({
  children,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  containerStyle = DEFAULT_CONTAINER_STYLE,
}) => {
  return (
    <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
      <GoogleMap
        clickableIcons={false}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={(maps) => {
          return {
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            mapTypeControl: true,
            mapTypeId: maps.MapTypeId.SATELLITE,
            mapTypeControlOptions: {
              style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
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
