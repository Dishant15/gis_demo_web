import {
  circle,
  point,
  lineString,
  booleanIntersects,
  distance,
} from "@turf/turf";

import { getSelectedLayerKeys } from "./planningState.selectors";
import { handleLayerSelect, handleRegionSelect } from "./planningState.reducer";
import { fetchLayerDataThunk } from "./actionBar.services";
import { getLayerViewData } from "./planningGis.selectors";
import {
  resetUnselectedLayerGisData,
  setMapState,
} from "./planningGis.reducer";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { addNotification } from "redux/reducers/notification.reducer";

export const onRegionSelectionUpdate =
  (updatedRegionIdList) => (dispatch, getState) => {
    const storeState = getState();
    const selectedLayerKeys = getSelectedLayerKeys(storeState);

    // set selected regions
    dispatch(handleRegionSelect(updatedRegionIdList));
    // add region in selectedLayerKeys if not
    if (selectedLayerKeys.indexOf("region") === -1) {
      dispatch(handleLayerSelect("region"));
    }
    // fetch gis data for all region polygons
    dispatch(
      fetchLayerDataThunk({
        regionIdList: updatedRegionIdList,
        layerKey: "region",
      })
    );
    // re fetch data for each selected layers
    for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
      const currLayerKey = selectedLayerKeys[l_ind];
      dispatch(
        fetchLayerDataThunk({
          regionIdList: updatedRegionIdList,
          layerKey: currLayerKey,
        })
      );
    }
    dispatch(resetUnselectedLayerGisData(selectedLayerKeys));
  };

export const onElementAddConnectionEvent =
  ({ layerKey, elementId, elementGeometry, existingConnections }) =>
  (dispatch, getState) => {
    const storeState = getState();
    // check if cable layer is selected in layers tab
    const selectedLayerKeys = getSelectedLayerKeys(storeState);
    if (selectedLayerKeys.indexOf("p_cable") === -1) {
      // dispatch error notification if not
      dispatch(
        addNotification({
          type: "error",
          title: "Please select Cable layer",
          text: "Cable layer needs to be selected to add connections",
        })
      );
      return;
    }
    let resultCableList = [];
    // if point element
    const elementPoint = point(elementGeometry);
    // create a circle around element
    const circPoly = circle(elementGeometry, 0.1, {
      steps: 10,
      units: "kilometers",
    });
    // get all cables intersecting that polygon
    const cableList = getLayerViewData("p_cable")(storeState);
    for (let c_ind = 0; c_ind < cableList.length; c_ind++) {
      const c_cable = cableList[c_ind];
      const isIntersecting = booleanIntersects(
        circPoly,
        lineString(c_cable.geometry)
      );
      if (isIntersecting) {
        // calculate which end of this cable is nearest to current point
        const Aend = c_cable.geometry[0];
        const Bend = c_cable.geometry[c_cable.geometry.length - 1];

        const distanceA = distance(elementPoint, point(Aend));
        const distanceB = distance(elementPoint, point(Bend));
        const cable_end = distanceA > distanceB ? "B" : "A";
        // add list of cables into data of current element, with cable end marker
        resultCableList.push({ ...c_cable, cable_end, layerKey: "p_cable" });
      }
    }
    // dispatch addElementConection
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementConnection,
        layerKey,
        data: {
          elementList: resultCableList,
          elementId,
          layerKey,
          existingConnections,
        },
      })
    );
  };
