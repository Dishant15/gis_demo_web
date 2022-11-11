import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { BuildingLayerForm } from "./BuildingLayerForm";

import { getPlanningMapStateEvent } from "planning/data/planningGis.selectors";
import { LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { latLongMapToCoords } from "utils/map.utils";

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
