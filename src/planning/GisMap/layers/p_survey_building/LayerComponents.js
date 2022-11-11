import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import AddMarkerLayer from "planning/GisMap/components/AddMarkerLayer";
import { BuildingLayerForm } from "./BuildingLayerForm";

import {
  getLayerViewData,
  getPlanningMapStateData,
  getPlanningMapStateEvent,
} from "planning/data/planningGis.selectors";
import { INITIAL_ELEMENT_DATA, LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { latLongMapToCoords } from "utils/map.utils";

import ElementDetailsTable from "planning/GisMap/components/ElementDetailsTable";
import EditMarkerLayer from "planning/GisMap/components/EditGisLayer";
import { default as Icon } from "assets/markers/building_view.svg";
import { default as EditIcon } from "assets/markers/building_pin.svg";
import { zIndexMapping } from "../common/configuration";

export const ElementForm = () => {
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;
  // transform and validate data according to that
  const transformAndValidateData = useCallback(
    (formData) => {
      if (isEdit) {
        return {
          ...formData,
          // remove coordinates
          geometry: undefined,
          address: "",
        };
      } else {
        return {
          ...formData,
          // remove coordinates and add geometry
          geometry: latLongMapToCoords([formData.coordinates])[0],
          address: "",
        };
      }
    },
    [isEdit]
  );

  return (
    <BuildingLayerForm
      isEdit={isEdit}
      layerKey={LAYER_KEY}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
