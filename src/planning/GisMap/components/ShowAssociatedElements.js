import React, { useCallback, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import size from "lodash/size";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import map from "lodash/map";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";

import LanguageIcon from "@mui/icons-material/Language";

import GisMapPopups from "./GisMapPopups";
import GisMapPopupLoader from "planning/GisMap/components/GisMapPopups/GisMapPopupLoader";

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
    return <GisMapPopupLoader />;
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
        {minimized ? null : <Content data={associations} />}
      </Box>
    </GisMapPopups>
  );
};

const Content = ({ data }) => {
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

  const groupedAssociations = groupBy(data, "layer_info.layer_key");

  if (!size(data))
    return (
      <Box p={2}>
        <Typography variant="h6" color="text.secondary">
          No associations
        </Typography>
      </Box>
    );

  return (
    <Stack py={1} maxHeight="72vh" overflow="auto">
      {map(groupedAssociations, (item, key) => {
        return (
          <CollapsibleContent
            key={key}
            layerKey={key}
            data={item}
            dataCount={size(item)}
            handleShowOnMap={handleShowOnMap}
            handleShowDetails={handleShowDetails}
          />
        );
      })}
    </Stack>
  );
};

const CollapsibleContent = ({
  layerKey,
  data,
  dataCount,
  handleShowOnMap,
  handleShowDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(dataCount < 5);

  const toggleExpand = useCallback(() => {
    setIsExpanded((val) => !val);
  }, [setIsExpanded]);

  // get icon
  const getViewOptions = get(LayerKeyMappings, [layerKey, "getViewOptions"]);
  const Icon = getViewOptions ? getViewOptions({}).icon : Fragment;

  return (
    <Box className="reg-list-pill clickable">
      <Stack
        sx={{
          color: "secondary.dark",
          borderBottom: "1px solid",
          borderBottomColor: "secondary.dark",
        }}
        direction="row"
        width="100%"
        spacing={2}
        onClick={toggleExpand}
      >
        <Box className="pl-layer-icon-block" ml={0.5}>
          <Box
            className="icon-wrapper"
            sx={{
              width: "38px !important",
              height: "38px !important",
              borderWidth: "0 !important",
            }}
          >
            <img src={Icon} alt={get(data, "0.layer_info.name", "")} />
          </Box>
        </Box>
        <Stack direction="row" flex={1} alignItems="center">
          <span>
            {get(data, "0.layer_info.name", "")} {`(${dataCount})`}
          </span>
        </Stack>
        <Box display="flex" pr={1}>
          <ExpandMore
            expand={isExpanded}
            aria-expanded={isExpanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
      </Stack>

      <Divider flexItem />

      {isExpanded ? (
        <ElementContentList
          elementList={data}
          handleShowOnMap={handleShowOnMap}
          handleShowDetails={handleShowDetails}
        />
      ) : null}
    </Box>
  );
};

const ElementContentList = ({
  elementList,
  handleShowDetails,
  handleShowOnMap,
}) => {
  return (
    <Box
      sx={{
        borderBottom: "1px solid",
        borderBottomColor: "secondary.dark",
      }}
    >
      {elementList.map(({ element, layer_info }) => {
        const { layer_key } = layer_info;
        const Icon =
          LayerKeyMappings[layer_key]["getViewOptions"](element).icon;
        const networkId = get(element, "network_id", "");
        return (
          <Fragment key={networkId}>
            <Stack direction="row" spacing={1} alignItems="center" py={1}>
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
            <Divider flexItem />
          </Fragment>
        );
      })}
    </Box>
  );
};

export default ShowAssociatedElements;
