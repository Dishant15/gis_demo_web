import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { addNotification } from "redux/reducers/notification.reducer";
import { setMapState } from "planning/data/planningGis.reducer";
import { LayerKeyMappings } from "../utils";

/**
 * Show add edit popups with submit / cancel handlers
 * Change map state with DrawingManager
 * handle refs to new created and Edited featurs of map
 *
 * Set coordinates in formData once complete is clicked
 * Update map state in reducer once current event ends
 * Reset mapState once cancel in clicked
 *
 * Parent
 *  GisMap
 *
 * Renders
 *  {LayerKey} -> AddLayer (export from layers folder) -> AddMarkerLayer | AddPolygonLayer
 */
const GisMapEventLayer = React.memo(() => {
  const dispatch = useDispatch();
  const mapState = useSelector(getPlanningMapState);

  useEffect(() => {
    if (!!mapState.event) {
      const MappedComponent =
        LayerKeyMappings[mapState.layerKey][mapState.event];
      if (!MappedComponent) {
        // if no component found dispatch error and reset mapState
        dispatch(
          addNotification({
            type: "error",
            title: "Can not process requested operation",
          })
        );
        dispatch(setMapState({}));
      }
    }
  }, [mapState.event, mapState.layerKey]);

  if (!!mapState.event) {
    const MappedComponent = LayerKeyMappings[mapState.layerKey][mapState.event];
    if (!!MappedComponent) {
      return MappedComponent;
    }
  }

  return null;
});

export default GisMapEventLayer;
