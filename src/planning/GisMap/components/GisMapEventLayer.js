import React from "react";
import { useSelector } from "react-redux";

import AddGisMapLayer from "./AddGisMapLayer";
import EditGisLayer from "./EditGisLayer";
import ElementDetailsTable from "./ElementDetailsTable";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { PLANNING_EVENT } from "../utils";

/**
 * Show add edit popups with submit / cancel handlers
 * Change map state with DrawingManager
 * handle refs to new created and Edited featurs of map
 *
 * Set coordinates in formData once complete is clicked
 * Update map state in reducer once current event ends
 * Reset mapState once cancel in clicked
 *
 * Parent
 *  GisMap
 *
 * Renders
 *  {LayerKey} -> AddLayer (export from layers folder) -> AddMarkerLayer | AddPolygonLayer
 */
const GisMapEventLayer = React.memo(() => {
  const { layerKey, event } = useSelector(getPlanningMapState);

  switch (event) {
    case PLANNING_EVENT.addElementGeometry:
      return <AddGisMapLayer layerKey={layerKey} />;
    case PLANNING_EVENT.editElementGeometry:
      return <EditGisLayer layerKey={layerKey} />;
    case PLANNING_EVENT.showElementDetails:
      // LookupError: App 'gis_layer' doesn't have a 'region' model.
      if (layerKey === "region") return null;
      return <ElementDetailsTable layerKey={layerKey} />;
    default:
      return null;
  }
});

export default GisMapEventLayer;
