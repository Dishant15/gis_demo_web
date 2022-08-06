import React, { useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "./map.constants";
import { PIN_P, SQUARE_P } from "./MarkerPaths";

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

export const RedMarker = (props) => {
  return (
    <Marker
      {...props}
      icon={{
        path: "M25 0c-8.284 0-15 6.656-15 14.866 0 8.211 15 35.135 15 35.135s15-26.924 15-35.135C40 6.656 33.284 0 25 0zm-.049 19.312c-2.557 0-4.629-2.055-4.629-4.588 0-2.535 2.072-4.589 4.629-4.589 2.559 0 4.631 2.054 4.631 4.589 0 2.533-2.072 4.588-4.631 4.588z",
        fillColor: "#d85b53",
        fillOpacity: 1,
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 1,
        scale: 0.8,
        anchor: new window.google.maps.Point(26, 50),
        labelOrigin: new window.google.maps.Point(26, 50),
      }}
    />
  );
};

export const RedMarker1 = (props) => {
  return (
    <Marker
      {...props}
      icon={{
        path: PIN_P,
        fillColor: "#d85b53",
        fillOpacity: 1,
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 1,
        scale: 0.8,
        anchor: new window.google.maps.Point(26, 50),
        labelOrigin: new window.google.maps.Point(26, 50),
      }}
    />
  );
};

export const RedMarker2 = (props) => {
  return (
    <Marker
      {...props}
      icon={{
        path: SQUARE_P,
        fillColor: "#d85b53",
        fillOpacity: 1,
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 1,
        scale: 0.8,
        anchor: new window.google.maps.Point(26, 50),
        labelOrigin: new window.google.maps.Point(26, 50),
      }}
    />
  );
};

export const GreenMarker = (props) => {
  return (
    <Marker
      {...props}
      icon={{
        path: "M25 0c-8.284 0-15 6.656-15 14.866 0 8.211 15 35.135 15 35.135s15-26.924 15-35.135C40 6.656 33.284 0 25 0zm-.049 19.312c-2.557 0-4.629-2.055-4.629-4.588 0-2.535 2.072-4.589 4.629-4.589 2.559 0 4.631 2.054 4.631 4.589 0 2.533-2.072 4.588-4.631 4.588z",
        fillColor: "#34a853",
        fillOpacity: 1,
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 1,
        scale: 0.8,
        anchor: new window.google.maps.Point(26, 50),
        labelOrigin: new window.google.maps.Point(26, 50),
      }}
    />
  );
};

export const BlueMarker = (props) => {
  return (
    <Marker
      {...props}
      icon={{
        path: "M25 0c-8.284 0-15 6.656-15 14.866 0 8.211 15 35.135 15 35.135s15-26.924 15-35.135C40 6.656 33.284 0 25 0zm-.049 19.312c-2.557 0-4.629-2.055-4.629-4.588 0-2.535 2.072-4.589 4.629-4.589 2.559 0 4.631 2.054 4.631 4.589 0 2.533-2.072 4.588-4.631 4.588z",
        fillColor: "#595bd4",
        fillOpacity: 1,
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 1,
        scale: 0.8,
        anchor: new window.google.maps.Point(26, 50),
        labelOrigin: new window.google.maps.Point(26, 50), // label position should change with anchor
      }}
      // label="My Marker" // pass this prop from parent
    />
  );
};

export default GoogleMapWrapper;
