import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { format } from "date-fns";

import get from "lodash/get";
import range from "lodash/range";

import {
  Divider,
  Stack,
  Typography,
  Skeleton,
  Chip,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CableIcon from "@mui/icons-material/Cable";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";

import GisMapPopups from "./GisMapPopups";

import { fetchElementDetails } from "planning/data/layer.services";
import { setMapProps, setMapState } from "planning/data/planningGis.reducer";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import { getContentHeight } from "redux/selectors/appState.selectors";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { checkUserPermission } from "redux/selectors/auth.selectors";
import {
  getPlanningTicketPage,
  getTicketWorkorderPage,
} from "utils/url.constants";
import { FEATURE_TYPES } from "../layers/common/configuration";
import { pointCoordsToLatLongMap } from "utils/map.utils";

/**
 * fetch element details
 * handle loading
 * show data in table form
 */
const ElementDetailsTable = ({ layerKey, onEditDataConverter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { elementId } = useSelector(getPlanningMapStateData);
  const hasLayerEditPermission = useSelector(
    checkUserPermission(`${layerKey}_edit`)
  );
  const hasEditPermission = layerKey !== "region" && hasLayerEditPermission;

  const { data: elemData, isLoading } = useQuery(
    ["elementDetails", layerKey, elementId],
    fetchElementDetails
  );

  const rowDefs = get(LayerKeyMappings, [layerKey, "elementTableFields"], []);
  // connections | associations
  const extraControls = get(
    LayerKeyMappings,
    [layerKey, "elementTableExtraControls"],
    []
  );
  const windowHeight = useSelector(getContentHeight);
  // contentHeight = windowHeight - (10% margin * 2 top & bot) - (title + action btns)
  const contentHeight = windowHeight - windowHeight * 0.1 - (60 + 70);

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
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
        dispatch(
          setMapProps({
            center: pointCoordsToLatLongMap(elemData.coordinates),
            zoom: 16,
          })
        );
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(
          setMapProps({
            center: pointCoordsToLatLongMap(elemData.center),
            zoom: 16,
          })
        );
        break;
      default:
        break;
    }
  }, [dispatch, layerKey, elemData]);

  const ExtraControls = extraControls.map((ctrl) => {
    switch (ctrl) {
      case "connections":
        return (
          <Button
            key={ctrl}
            onClick={() =>
              dispatch(
                setMapState({
                  event: PLANNING_EVENT.showElementConnections,
                  layerKey,
                  data: {
                    elementId: elemData.id,
                    elementGeometry: elemData.coordinates,
                  },
                })
              )
            }
            startIcon={<CableIcon />}
            variant="outlined"
            color="secondary"
          >
            Connections
          </Button>
        );
      case "workorders":
        return (
          <Button
            key={ctrl}
            onClick={handleShowWorkorder}
            startIcon={<CableIcon />}
            variant="outlined"
            color="secondary"
          >
            Show Workorders
          </Button>
        );
      default:
        return null;
    }
  });

  // show dummy loader for loading
  if (isLoading) return <ElemTableDummyLoader />;

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          p={1}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            Element Details
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* Button container */}
        <Stack
          sx={{ boxShadow: "0px 5px 7px -3px rgba(122,122,122,0.51)" }}
          p={2}
          direction="row"
          spacing={2}
        >
          {hasEditPermission ? (
            <>
              <Button
                onClick={handleEditDetails}
                startIcon={<EditIcon />}
                variant="outlined"
                color="secondary"
              >
                Details
              </Button>
              <Button
                onClick={handleEditLocation}
                startIcon={<EditLocationAltIcon />}
                variant="outlined"
                color="secondary"
              >
                Location
              </Button>
            </>
          ) : null}
          <Button
            onClick={handleShowOnMap}
            startIcon={<LocationSearchingIcon />}
            variant="outlined"
            color="secondary"
          >
            Show on map
          </Button>
          {ExtraControls}
        </Stack>
        {/* Table Content */}
        <Stack
          sx={{
            maxHeight: `${contentHeight}px`,
            overflowY: "auto",
          }}
          divider={<Divider />}
        >
          {rowDefs.map((row) => {
            const { label, field, type } = row;
            let ValueCell;

            switch (type) {
              case "status":
                const elemStatus = get(elemData, field);
                if (!elemStatus) return null;
                const color =
                  elemStatus === "V"
                    ? "success"
                    : elemStatus === "P"
                    ? "warning"
                    : "error";

                ValueCell = (
                  <Box textAlign="center" width={"50%"}>
                    <Chip
                      label={get(elemData, `${field}_display`)}
                      color={color}
                    />
                  </Box>
                );
                break;

              case "boolean":
                const elemBoolData = get(elemData, field);

                ValueCell = (
                  <Box textAlign="center" width={"50%"}>
                    <IconButton color={elemBoolData ? "success" : "error"}>
                      {elemBoolData ? <CheckIcon /> : <ClearIcon />}
                    </IconButton>
                  </Box>
                );
                break;

              case "date":
                const formattedDate = format(
                  new Date(get(elemData, field)),
                  "dd/MM/YYY"
                );

                ValueCell = (
                  <Typography
                    sx={{ whiteSpace: "pre" }}
                    textAlign="center"
                    width={"50%"}
                  >
                    {formattedDate}
                  </Typography>
                );
                break;

              default:
                ValueCell = (
                  <Typography textAlign="center" width={"50%"}>
                    {get(elemData, field, "--") || "--"}
                  </Typography>
                );
                break;
            }

            return (
              <Stack direction="row" key={field} p={2}>
                <Typography color="primary.main" textAlign="left" width={"50%"}>
                  {label}
                </Typography>
                {ValueCell}
              </Stack>
            );
          })}
        </Stack>
      </Box>
    </GisMapPopups>
  );
};

export const ElemTableDummyLoader = () => {
  const rowPills = range(6);
  return (
    <GisMapPopups>
      <Stack>
        {rowPills.map((ind) => {
          return <Skeleton key={ind} animation="wave" height="30px" />;
        })}
      </Stack>
    </GisMapPopups>
  );
};

export default ElementDetailsTable;
