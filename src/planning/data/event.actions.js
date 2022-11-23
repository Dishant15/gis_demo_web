import { PLANNING_EVENT } from "planning/GisMap/utils";
import { setMapState } from "./planningGis.reducer";

export const showPossibleAddAssociatiation =
  ({ layerKey, elementId, elementName, listOfLayers }) =>
  (dispatch) => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showPossibleAddAssociatiation,
        layerKey,
        data: { elementId, elementName, listOfLayers },
      })
    );
  };
