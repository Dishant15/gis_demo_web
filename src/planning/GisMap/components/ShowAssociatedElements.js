import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import size from "lodash/size";
import get from "lodash/get";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";

import LanguageIcon from "@mui/icons-material/Language";

import DummyLoader from "./ElementDetailsTable/DummyLoader";
import GisMapPopups from "./GisMapPopups";
import TableHeader from "./ElementDetailsTable/TableHeader";

import { setMapState } from "planning/data/planningGis.reducer";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { fetchElementAssociations } from "planning/data/layer.services";
import { LayerKeyMappings } from "../utils";
import {
  onAssociatedElementShowOnMapClick,
  openElementDetails,
} from "planning/data/planning.actions";

/**
 * Parent:
 *    GisMapEventLayer
 */
const ShowAssociatedElements = () => {
  const [minimized, setMinimized] = useState(false);
  const dispatch = useDispatch();

  const { layerKey, data } = useSelector(getPlanningMapState);
  const { elementId } = data;

  const { data: associations, isLoading } = useQuery(
    ["elementAssociations", layerKey, elementId],
    fetchElementAssociations
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    setMinimized((val) => !val);
  }, []);

  if (isLoading) {
    return <DummyLoader />;
  }

  return (
    <GisMapPopups dragId="ShowAssociatedElements">
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <TableHeader
          title="Associated Elements"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : <ElementList data={associations} />}
      </Box>
    </GisMapPopups>
  );
};

const ElementList = ({ data }) => {
  const dispatch = useDispatch();

  const handleShowOnMap = useCallback(
    (element, layerKey) => () => {
      dispatch(onAssociatedElementShowOnMapClick(element, layerKey));
    },
    []
  );

  const handleShowDetails = useCallback(
    (elementId, layerKey) => () => {
      dispatch(
        openElementDetails({
          layerKey,
          elementId,
        })
      );
    },
    []
  );

  if (!size(data))
    return (
      <Box p={2}>
        <Typography variant="h6" color="text.secondary">
          No associations
        </Typography>
      </Box>
    );

  return (
    <Stack spacing={1} divider={<Divider />} py={1}>
      {data.map(({ element, layer_info }) => {
        const { layer_key } = layer_info;
        const Icon =
          LayerKeyMappings[layer_key]["getViewOptions"](element).icon;
        const networkId = get(element, "network_id", "");
        return (
          <Stack
            key={networkId}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Paper
              sx={{
                width: "42px",
                height: "42px",
                lineHeight: "42px",
                textAlign: "center",
                marginLeft: "8px",
              }}
            >
              <img
                className="responsive-img"
                src={Icon}
                alt={layer_info.layer_key}
              />
            </Paper>
            <Stack flex={1} flexDirection="row">
              <Box
                flex={1}
                className="clickable"
                onClick={handleShowDetails(element.id, layer_key)}
              >
                <Typography variant="subtitle1" lineHeight={1.1}>
                  {get(element, "name", "")}
                </Typography>
                <Typography variant="caption">#{networkId}</Typography>
              </Box>
              <Tooltip title="Show on map">
                <IconButton
                  sx={{
                    marginLeft: "8px",
                    marginRight: "8px",
                  }}
                  aria-label="show-location"
                  onClick={handleShowOnMap(element, layer_info.layer_key)}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ShowAssociatedElements;
