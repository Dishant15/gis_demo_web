import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import get from "lodash/get";

import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import CableIcon from "@mui/icons-material/Cable";
import AddIcon from "@mui/icons-material/Add";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "./TableHeader";
import DummyLoader from "./DummyLoader";
import TableActions from "./TableActions";
import TableContent from "./TableContent";

import { fetchElementDetails } from "planning/data/layer.services";
import {
  setMapState,
  toggleMapPopupMinimize,
} from "planning/data/planningGis.reducer";
import { LayerKeyMappings, PLANNING_EVENT } from "planning/GisMap/utils";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { checkUserPermission } from "redux/selectors/auth.selectors";
import {
  getPlanningTicketPage,
  getTicketWorkorderPage,
} from "utils/url.constants";

import { FEATURE_TYPES } from "planning/GisMap/layers/common/configuration";
import {
  onPointShowOnMap,
  onPolygonShowOnMap,
} from "planning/data/planning.actions";
import { showPossibleAddAssociatiation } from "planning/data/event.actions";

/**
 * fetch element details
 * handle loading
 * show data in table form
 *
 * renders:
 *    GisMapPopups
 *    TableHeader
 *    TableActions
 *    TableContent
 */
const ElementDetailsTable = ({ layerKey, onEditDataConverter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { minimized, data } = useSelector(getPlanningMapState);
  const { elementId } = data;
  const hasLayerEditPermission = useSelector(
    checkUserPermission(`${layerKey}_edit`)
  );
  const hasEditPermission = layerKey !== "region" && hasLayerEditPermission;

  const { data: elemData, isLoading } = useQuery(
    ["elementDetails", layerKey, elementId],
    fetchElementDetails
  );

  // connections | associations
  const extraControls = get(
    LayerKeyMappings,
    [layerKey, "elementTableExtraControls"],
    []
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    dispatch(toggleMapPopupMinimize());
  }, [dispatch]);

  const handleEditDetails = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementForm,
        layerKey,
        data: onEditDataConverter ? onEditDataConverter(elemData) : elemData,
      })
    );
  }, [dispatch, layerKey, elemData, onEditDataConverter]);

  const handleEditLocation = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementGeometry,
        layerKey,
        // pass elem data to update edit icon / style based on configs
        data: {
          ...elemData,
          elementId: elemData.id,
          coordinates: elemData.coordinates,
        },
      })
    );
  }, [dispatch, layerKey, elemData]);

  const handleShowWorkorder = useCallback(() => {
    if (elemData.ticket_type === "P") {
      navigate(getPlanningTicketPage(elemData.id));
    } else {
      navigate(getTicketWorkorderPage(elemData.id));
    }
  }, [navigate, elemData]);

  const handleShowOnMap = useCallback(() => {
    const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);
    switch (featureType) {
      case FEATURE_TYPES.POINT:
        dispatch(onPointShowOnMap(elemData.coordinates, elemData.id, layerKey));
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(onPolygonShowOnMap(elemData.center, elemData.id, layerKey));
        break;
      default:
        break;
    }
  }, [dispatch, layerKey, elemData]);

  const handleAddConnections = useCallback(
    (layerKeys) => {
      dispatch(
        showPossibleAddAssociatiation({
          layerKey,
          elementId: elemData.id,
          elementName: elemData.name,
          listOfLayers: layerKeys,
        })
      );
    },
    [dispatch, layerKey, elemData]
  );

  const { baseActionsList } = useMemo(() => {
    const baseActionsList = [];
    if (hasEditPermission) {
      baseActionsList.push({
        name: "Details",
        Icon: EditIcon,
        onClick: handleEditDetails,
      });

      baseActionsList.push({
        name: "Location",
        Icon: EditLocationAltIcon,
        onClick: handleEditLocation,
      });
    }

    baseActionsList.push({
      name: "Show on map",
      Icon: LocationSearchingIcon,
      onClick: handleShowOnMap,
    });

    if (extraControls?.length) {
      for (let index = 0; index < extraControls.length; index++) {
        const currControl = extraControls[index];
        const { control, data } = currControl;

        if (control === "connections") {
          baseActionsList.push({
            name: "Connections",
            Icon: CableIcon,
            onClick: () =>
              dispatch(
                setMapState({
                  event: PLANNING_EVENT.showElementConnections,
                  layerKey,
                  data: {
                    elementId: elemData.id,
                    elementGeometry: elemData.coordinates,
                  },
                })
              ),
          });
        }
        //
        else if (control === "workorders") {
          baseActionsList.push({
            name: "Show Workorders",
            Icon: CableIcon,
            onClick: handleShowWorkorder,
          });
        }
        //
        else if (control === "associations") {
          baseActionsList.push({
            name: "Add Associated Elements",
            Icon: AddIcon,
            // data = [ layerKeys, ...]
            onClick: () => handleAddConnections(data),
          });
        }
      }
    }
    return { baseActionsList };
  }, [
    hasEditPermission,
    dispatch,
    layerKey,
    elemData,
    onEditDataConverter,
    extraControls,
  ]);

  // show dummy loader for loading
  if (isLoading) return <DummyLoader />;

  return (
    <GisMapPopups dragId="element-table">
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <TableHeader
          title="Element Details"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : (
          <>
            <TableActions baseList={baseActionsList} />
            <TableContent layerKey={layerKey} elemData={elemData} />
          </>
        )}
      </Box>
    </GisMapPopups>
  );
};

export default ElementDetailsTable;
