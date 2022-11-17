import React from "react";
import { useSelector } from "react-redux";

import get from "lodash/get";

import AddGisMapLayer from "./AddGisMapLayer";
import EditGisMapLayer from "./EditGisMapLayer";
import ElementDetailsTable from "./ElementDetailsTable";
import ListElementConnections from "../layers/common/ListElementConnections";
import AddElementConnection from "../layers/common/AddElementConnection";
import { TicketWorkOrders } from "../layers/ticket";
import { GisLayerForm } from "./GisLayerForm";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";

/**
 * Intermediate component to handle what to render on which event
 * check if LayerKeyMappings has a component for given even and layerKey
 * Render default component if not
 *
 * Parent
 *  GisMap
 *
 * Renders
 *  Forms, Popup while map is in add / edit geom. mode, Table, ..etc
 */
const GisMapEventLayer = React.memo(() => {
  const { layerKey, event } = useSelector(getPlanningMapState);

  switch (event) {
    case PLANNING_EVENT.addElementGeometry:
      return <AddGisMapLayer layerKey={layerKey} />;

    case PLANNING_EVENT.editElementGeometry:
      return <EditGisMapLayer layerKey={layerKey} />;

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
      return <ElementDetailsTable layerKey={layerKey} />;

    case PLANNING_EVENT.showElementConnections:
      return <ListElementConnections layerKey={layerKey} />;

    case PLANNING_EVENT.addElementConnection:
      return <AddElementConnection />;

    case PLANNING_EVENT.showTicketWorkOrders:
      return <TicketWorkOrders />;

    default:
      return null;
  }
});

export default GisMapEventLayer;
