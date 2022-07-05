import React, { forwardRef, useCallback, useEffect } from "react";

import { Polygon } from "@react-google-maps/api";

const DEFAULT_OPTIONS = {
  fillColor: "orange",
  fillOpacity: 0.3,
  strokeColor: "orange",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: true,
  draggable: true,
  editable: true,
  geodesic: false,
  zIndex: 50,
};

/**
 * Render polygon in Edit mode
 * attach polygon ref and pass to parent
 */
const EditPolygonLayer = forwardRef(({ coordinates, options = {} }, ref) => {
  useEffect(() => {
    return () => {
      if (!!ref.current) ref.current.setMap(null);
      ref.current = null;
    };
  }, []);

  const handleEditPolygonLoad = useCallback((polygon) => {
    ref.current = polygon;
  }, []);

  return (
    <>
      <Polygon
        options={{ ...DEFAULT_OPTIONS, ...options }}
        onLoad={handleEditPolygonLoad}
        paths={coordinates}
      />
    </>
  );
});

export default EditPolygonLayer;
