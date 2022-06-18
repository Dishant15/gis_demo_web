import React, { forwardRef, useCallback } from "react";

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
  zIndex: 5,
};

/**
 * Render polygon in Edit mode
 * Show a popup with helptext and submit btn
 * call onEditComplete with updated coordinates on submit btn click
 */
const EditPolygonLayer = forwardRef(({ coordinates, options = {} }, ref) => {
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
