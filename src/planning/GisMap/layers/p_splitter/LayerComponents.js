import React from "react";
import { useSelector } from "react-redux";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { LAYER_KEY } from "./configurations";

import ListElementConnections from "../common/ListElementConnections";
import AddElementConnection from "../common/AddElementConnection";

export const ElementConnections = () => {
  const elemData = useSelector(getPlanningMapStateData);
  return <ListElementConnections layerKey={LAYER_KEY} {...elemData} />;
};

export const LayerAddConnection = () => {
  return <AddElementConnection />;
};
