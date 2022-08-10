import React from "react";
import { useQuery } from "react-query";

import { noop } from "lodash";
import { Box, Divider, Stack } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";

import DummyListLoader from "./DummyListLoader";

import { fetchLayerList } from "planning/data/actionBar.services";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { getLayerNetworkState } from "planning/data/planningGis.selectors";

const LayersTabContent = () => {
  /**
   * Render list of elements user can view on map
   * User can click and get data of layers
   * handle layer data loading
   *
   * Parent
   *  ActionBar
   */

  const { isLoading, data: layerCofigs = [] } = useQuery(
    "planningLayerConfigs",
    fetchLayerList
  );
  const regionNetState = useSelector(getLayerNetworkState("region"));
  console.log(
    "🚀 ~ file: LayersTabContent.js ~ line 32 ~ LayersTabContent ~ regionNetState",
    regionNetState
  );
  const isExpanded = false;

  if (isLoading) return <DummyListLoader />;

  return (
    <Stack>
      <Box className="reg-list-pill">
        <Stack direction="row" width="100%" spacing={2}>
          <Box onClick={noop}>
            <ExpandMore
              expand={isExpanded}
              aria-expanded={isExpanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Box>
          <Stack
            direction="row"
            flex={1}
            sx={{
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={noop}
          >
            <span>Region</span>
            <LoadingButton loading />
          </Stack>
        </Stack>

        <Divider flexItem />
      </Box>

      {layerCofigs.map((layer) => {
        const { layer_key, name } = layer;
        const layerLoading = false;

        return (
          <Box key={layer_key} className="reg-list-pill">
            <Stack direction="row" width="100%" spacing={2}>
              <Box onClick={noop}>
                <ExpandMore
                  expand={isExpanded}
                  aria-expanded={isExpanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>
              <Stack
                direction="row"
                flex={1}
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={noop}
              >
                <span>{name}</span>
                {layerLoading ? <LoadingButton loading /> : <CheckBoxIcon />}
              </Stack>
            </Stack>

            <Divider flexItem />
          </Box>
        );
      })}
    </Stack>
  );
};

export default LayersTabContent;
