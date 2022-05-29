import React, { useEffect, forwardRef } from "react";

const MapComponent = forwardRef((props, ref) => {
  let { center, zoom, mapRef } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });

    mapRef.current = map;
  }, []);

  return <div ref={ref} id="map" />;
});

export default MapComponent;
