import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import {
  get,
  difference,
  noop,
  groupBy,
  map,
  xor,
  orderBy,
  size,
} from "lodash";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";
import DummyListLoader from "./DummyListLoader";

import {
  fetchLayerDataThunk,
  fetchRegionList,
} from "planning/data/actionBar.services";
import { getFillColor } from "utils/map.utils";
import {
  handleLayerSelect,
  handleRegionExpand,
  handleRegionSelect,
  setActiveTab,
} from "planning/data/planningState.reducer";
import {
  getExpandedRegionIds,
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from "planning/data/planningState.selectors";

const RegionTabContent = () => {
  /**
   * Parent
   *  ActionBar
   */
  const { isLoading, data: regionList = [] } = useQuery(
    "planningRegionList",
    fetchRegionList
  );

  const dispatch = useDispatch();
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const expandedRegionIds = useSelector(getExpandedRegionIds);
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);
  const [selectedRegionSet, setSelectedRegion] = useState(
    new Set(selectedRegionIds)
  );

  const [regionGroupData, baseRegionList] = useMemo(() => {
    // group data by parent
    let resultGroupData = groupBy(regionList, "parent");
    // get list of parent keys
    const keyList = Object.keys(resultGroupData).map((k) => {
      if (k === "null") return null;
      return Number(k);
    });
    // get all the parent key list that is not in regionList ; e.x. null, or other
    // get list of ids
    const idList = map(regionList, "id");
    // get difference on keyList and idList
    const mergeList = difference(keyList, idList);
    // concat list of all groups with unknown parents that is our base layer
    let baseRegionList = [];
    for (let mListInd = 0; mListInd < mergeList.length; mListInd++) {
      const rId = mergeList[mListInd];
      baseRegionList = baseRegionList.concat(resultGroupData[String(rId)]);
    }
    // order by layer
    baseRegionList = orderBy(baseRegionList, ["layer"], ["asc"]);
    // return cancat list as first base list to render
    return [resultGroupData, baseRegionList];
  }, [regionList]);

  const handleRegionClick = useCallback((regionId) => {
    setSelectedRegion((regionSet) => {
      let newSet = new Set(regionSet);
      if (newSet.has(regionId)) {
        newSet.delete(regionId);
      } else {
        newSet.add(regionId);
      }
      return newSet;
    });
  }, []);

  const handleRegionExpandClick = useCallback((regionId) => {
    dispatch(handleRegionExpand(regionId));
  }, []);

  const handleRegionSelectionComplete = useCallback(() => {
    const regionIdList = Array.from(selectedRegionSet);
    // can not go forward if region list empty
    if (!size(regionIdList)) return;
    // check if regions changed
    if (size(xor(regionIdList, selectedRegionIds))) {
      // set selected regions
      dispatch(handleRegionSelect(regionIdList));
      // add region in selectedLayerKeys if not
      if (selectedLayerKeys.indexOf("region") === -1) {
        dispatch(handleLayerSelect("region"));
      }
      // fetch data gis data for all region polygons
      dispatch(fetchLayerDataThunk({ regionIdList, layerKey: "region" }));
      // re fetch data for each selected layers
      for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
        const currLayerKey = selectedLayerKeys[l_ind];
        dispatch(fetchLayerDataThunk({ regionIdList, layerKey: currLayerKey }));
      }
    }
    // change tab to layers
    dispatch(setActiveTab(1));
  }, [selectedRegionSet, selectedRegionIds, selectedLayerKeys]);

  if (isLoading) return <DummyListLoader />;

  return (
    <Stack>
      <Stack p={2} direction="row" justifyContent="space-between">
        <Typography variant="h6" color="primary">
          Select Regions
        </Typography>
        <Button
          variant="outlined"
          color="success"
          size="small"
          startIcon={<CheckIcon />}
          disabled={!size(selectedRegionSet)}
          onClick={handleRegionSelectionComplete}
        >
          Done
        </Button>
      </Stack>
      <Divider />
      <Stack>
        {baseRegionList.map((region) => {
          return (
            <RegionListItem
              key={region.id}
              region={region}
              regionGroupData={regionGroupData}
              selectedRegion={selectedRegionSet}
              expandedRegions={expandedRegionIds}
              handleRegionClick={handleRegionClick}
              handleRegionExpandClick={handleRegionExpandClick}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

const RegionListItem = ({
  region,
  regionGroupData,
  selectedRegion,
  expandedRegions,
  handleRegionClick,
  handleRegionExpandClick,
}) => {
  const { id, name, layer } = region;
  const color = getFillColor(layer);
  const isActive = selectedRegion.has(id);
  // check if childs are open
  const regionChilds = get(regionGroupData, id, []);
  const hasChildren = !!size(regionChilds);
  const isExpanded = hasChildren && expandedRegions.indexOf(id) > -1;
  const borderLeft = isExpanded ? `1px solid ${color}` : null;

  return (
    <Box className="reg-list-pill" sx={{ borderLeft }}>
      <Stack direction="row" width="100%" spacing={2}>
        <Box
          sx={{ opacity: hasChildren ? 1 : 0.3 }}
          onClick={hasChildren ? () => handleRegionExpandClick(id) : noop}
        >
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
            color,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => handleRegionClick(id)}
        >
          <span>{name}</span>
          {isActive ? <CheckBoxIcon color="secondary" /> : null}
        </Stack>
      </Stack>

      <Divider flexItem />

      <Collapse in={isExpanded}>
        <>
          {regionChilds.map((regionChild) => {
            return (
              <RegionListItem
                key={regionChild.id}
                region={regionChild}
                regionGroupData={regionGroupData}
                selectedRegion={selectedRegion}
                expandedRegions={expandedRegions}
                handleRegionClick={handleRegionClick}
                handleRegionExpandClick={handleRegionExpandClick}
              />
            );
          })}
        </>
      </Collapse>
    </Box>
  );
};

export default RegionTabContent;
