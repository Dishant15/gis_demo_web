import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import GisMapPopups from "./GisMapPopups";
import TableHeader from "./ElementDetailsTable/TableHeader";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { LayerKeyMappings } from "../utils";
import {
  onElementListItemClick,
  openElementDetails,
} from "planning/data/planning.actions";

const ElementList = () => {
  const [minimized, setMinimized] = useState(false);
  const dispatch = useDispatch();
  const { elementList } = useSelector(getPlanningMapStateData);

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    setMinimized((val) => !val);
  }, []);

  return (
    <GisMapPopups dragId="ElementList">
      <Box minWidth="350px" maxWidth="550px">
        <TableHeader
          title="Element List"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : <ElementListTable elementList={elementList} />}
      </Box>
    </GisMapPopups>
  );
};

const ElementListTable = ({ elementList }) => {
  const dispatch = useDispatch();

  const handleShowOnMap = useCallback(
    (element) => () => {
      dispatch(onElementListItemClick(element));
    },
    []
  );

  const handleShowDetails = useCallback(
    (element) => () => {
      dispatch(
        openElementDetails({
          layerKey: element.layerKey,
          elementId: element.id,
        })
      );
    },
    []
  );

  if (!size(elementList))
    return (
      <Box p={2}>
        <Typography variant="h6" color="text.secondary">
          No element available arround selected area
        </Typography>
      </Box>
    );

  return (
    <Stack spacing={1} divider={<Divider />} py={1}>
      {elementList.map((element) => {
        const Icon = LayerKeyMappings[element.layerKey]["getViewOptions"](
          {}
        ).icon;

        return (
          <Stack
            key={element.id}
            direction="row"
            spacing={1}
            alignItems="center"
            py={0.5}
            className="change-bg-on-hover"
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
                alt={element.layerKey}
              />
            </Paper>
            <Stack flex={1} flexDirection="row">
              <Box
                className="clickable"
                flex={1}
                onClick={handleShowDetails(element)}
              >
                <Typography variant="subtitle1" lineHeight={1.1}>
                  {get(element, "name", "")}
                </Typography>
                <Typography variant="caption">
                  #{get(element, "network_id", "")}
                </Typography>
              </Box>
              <Tooltip title="Show on map">
                <IconButton
                  sx={{
                    marginLeft: "8px",
                    marginRight: "8px",
                  }}
                  aria-label="show-location"
                  onClick={handleShowOnMap(element)}
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

export default ElementList;
