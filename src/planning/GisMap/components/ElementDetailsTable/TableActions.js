import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

import EditIcon from "@mui/icons-material/Edit";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import CableIcon from "@mui/icons-material/Cable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import LanguageIcon from "@mui/icons-material/Language";
import LanIcon from "@mui/icons-material/Lan";

import { checkUserPermission } from "redux/selectors/auth.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { LayerKeyMappings, PLANNING_EVENT } from "planning/GisMap/utils";
import {
  onPointShowOnMap,
  onPolygonShowOnMap,
} from "planning/data/planning.actions";
import { FEATURE_TYPES } from "planning/GisMap/layers/common/configuration";
import {
  editElementGeometry,
  showAssociatiationList,
  showPossibleAddAssociatiation,
} from "planning/data/event.actions";
import {
  getPlanningTicketPage,
  getTicketWorkorderPage,
} from "utils/url.constants";

/**
 * Parent:
 *    ElementDetailsTable
 */
const TableActions = ({ layerKey, elemData, onEditDataConverter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasLayerEditPermission = useSelector(
    checkUserPermission(`${layerKey}_edit`)
  );

  // connections | associations
  const extraControls = get(
    LayerKeyMappings,
    [layerKey, "elementTableExtraControls"],
    []
  );

  const baseActionsList = useMemo(() => {
    const baseActionsList = [];

    if (hasLayerEditPermission) {
      baseActionsList.push({
        name: "Details",
        Icon: EditIcon,
        onClick: () => {
          dispatch(
            setMapState({
              event: PLANNING_EVENT.editElementForm,
              layerKey,
              data: onEditDataConverter
                ? onEditDataConverter(elemData)
                : elemData,
            })
          );
        },
      });

      baseActionsList.push({
        name: "Location",
        Icon: EditLocationAltIcon,
        onClick: () => {
          dispatch(editElementGeometry({ layerKey, elementData: elemData }));
        },
      });
    }

    baseActionsList.push({
      name: "Show on map",
      Icon: LanguageIcon,
      onClick: () => {
        const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);
        switch (featureType) {
          case FEATURE_TYPES.POINT:
            dispatch(
              onPointShowOnMap(elemData.coordinates, elemData.id, layerKey)
            );
            break;
          case FEATURE_TYPES.POLYGON:
          case FEATURE_TYPES.POLYLINE:
          case FEATURE_TYPES.MULTI_POLYGON:
            dispatch(
              onPolygonShowOnMap(elemData.center, elemData.id, layerKey)
            );
            break;
          default:
            break;
        }
      },
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
            Icon: VisibilityIcon,
            onClick: () => {
              if (elemData.ticket_type === "P") {
                navigate(getPlanningTicketPage(elemData.id));
              } else {
                navigate(getTicketWorkorderPage(elemData.id));
              }
            },
          });
        }
        //
        else if (control === "add_associations") {
          baseActionsList.push({
            name: "Add Associated Elements",
            Icon: AddIcon,
            // data = [ layerKeys, ...]
            onClick: () => {
              dispatch(
                showPossibleAddAssociatiation({
                  layerKey,
                  elementData: elemData,
                  listOfLayers: data,
                })
              );
            },
          });
        }
        //
        else if (control === "association_list") {
          baseActionsList.push({
            name: "Show Associations",
            Icon: LanIcon,
            onClick: () => {
              dispatch(
                showAssociatiationList({
                  layerKey,
                  elementId: elemData.id,
                })
              );
            },
          });
        }
      }
    }
    return baseActionsList;
  }, [
    hasLayerEditPermission,
    dispatch,
    layerKey,
    elemData,
    onEditDataConverter,
    extraControls,
  ]);

  return (
    <Stack
      sx={{ boxShadow: "0px 5px 7px -3px rgba(122,122,122,0.51)" }}
      p={2}
      direction="row"
      spacing={2}
    >
      {baseActionsList.map(({ name, Icon, onClick }) => {
        return (
          <Tooltip title={name} key={name}>
            <IconButton
              aria-label={name}
              color="secondary"
              sx={{
                border: "1px solid",
                borderRadius: 1,
              }}
              onClick={onClick}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default TableActions;
