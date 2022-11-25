import { PLANNING_EVENT } from "planning/GisMap/utils";
import { setMapState } from "./planningGis.reducer";

export const showPossibleAddAssociatiation =
  ({ layerKey, elementData, listOfLayers }) =>
  (dispatch) => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showPossibleAddAssociatiation,
        layerKey,
        data: { elementData, listOfLayers },
      })
    );
  };

export const showAssociatiationList =
  ({ layerKey, elementId }) =>
  (dispatch) => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showAssociatedElements,
        layerKey,
        data: { elementId },
      })
    );
  };
