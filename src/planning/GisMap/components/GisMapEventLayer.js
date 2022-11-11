import React from "react";
import { useSelector } from "react-redux";

import AddGisMapLayer from "./AddGisMapLayer";
import EditGisLayer from "./EditGisLayer";
import ElementDetailsTable from "./ElementDetailsTable";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import ListElementConnections from "../layers/common/ListElementConnections";
import AddElementConnection from "../layers/common/AddElementConnection";
import { GisLayerForm } from "./GisLayerForm";
import { get } from "lodash";

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
    case PLANNING_EVENT.addElementForm:
      const OverrideAddForm = get(LayerKeyMappings, [
        layerKey,
        PLANNING_EVENT.addElementForm,
      ]);
      if (!!OverrideAddForm) return <OverrideAddForm />;
      return <GisLayerForm layerKey={layerKey} />;
    case PLANNING_EVENT.editElementForm:
      const OverrideEditForm = get(LayerKeyMappings, [
        layerKey,
        PLANNING_EVENT.editElementForm,
      ]);
      if (!!OverrideEditForm) return <OverrideEditForm />;
      return <GisLayerForm layerKey={layerKey} />;
    case PLANNING_EVENT.showElementDetails:
      // LookupError: App 'gis_layer' doesn't have a 'region' model.
      if (layerKey === "region") return null;
      return <ElementDetailsTable layerKey={layerKey} />;

    case PLANNING_EVENT.showElementConnections:
      return <ListElementConnections layerKey={layerKey} />;

    case PLANNING_EVENT.addElementConnection:
      return <AddElementConnection />;
    default:
      return null;
  }
});

export default GisMapEventLayer;
