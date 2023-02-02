import { Marker } from "@react-google-maps/api";

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