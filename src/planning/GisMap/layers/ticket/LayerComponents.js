import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import TicketLayerForm from "./TicketLayerForm";

import { getPlanningMapStateEvent } from "planning/data/planningGis.selectors";
import { LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";

export const ElementForm = () => {
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

  return <TicketLayerForm isEdit={isEdit} layerKey={LAYER_KEY} />;
};
