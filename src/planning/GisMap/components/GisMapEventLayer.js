import React from "react";
import { useSelector } from "react-redux";

import get from "lodash/get";

import AddGisMapLayer from "./AddGisMapLayer";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import { getLayerSelectedConfiguration } from "planning/data/planningState.selectors";

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

    default:
      return null;
  }
});

export default GisMapEventLayer;
