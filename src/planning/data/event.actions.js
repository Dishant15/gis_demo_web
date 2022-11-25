import { PLANNING_EVENT } from "planning/GisMap/utils";
import { hideElement, setMapState } from "./planningGis.reducer";

export const editElementGeometry =
  ({ layerKey, elementData }) =>
  (dispatch) => {
    // fire edit geometry event
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementGeometry,
        layerKey,
        // pass elem data to update edit icon / style based on configs
        data: {
          ...elementData,
          elementId: elementData.id,
          coordinates: elementData.coordinates,
        },
      })
    );
    // hide element that is being edited from layerData
    dispatch(hideElement({ layerKey, elementId: elementData.id }));
  };

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
