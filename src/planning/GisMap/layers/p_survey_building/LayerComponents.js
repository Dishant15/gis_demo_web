import React from "react";
import { useSelector } from "react-redux";

import { BuildingLayerForm } from "./BuildingLayerForm";

import { getPlanningMapStateEvent } from "planning/data/planningGis.selectors";
import { LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";

export const ElementForm = () => {
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

  return <BuildingLayerForm isEdit={isEdit} layerKey={LAYER_KEY} />;
};
