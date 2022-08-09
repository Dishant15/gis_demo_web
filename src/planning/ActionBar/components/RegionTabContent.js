import React, { useMemo } from "react";
import { useQuery } from "react-query";

import {
  get,
  find,
  groupBy,
  isNull,
  pick,
  map,
  difference,
  orderBy,
  size,
} from "lodash";
import { Box, Stack } from "@mui/material";

import { fetchRegionList } from "planning/data/actionBar.services";
import DummyListLoader from "./DummyListLoader";

const RegionTabContent = () => {
  const { isLoading, data: regionList = [] } = useQuery(
    "planningRegionList",
    fetchRegionList
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

  if (isLoading) {
    return <DummyListLoader />;
  }

  return (
    <Box>
      <Stack>
        {regionList.map((region) => {
          const { id, name } = region;
          return <Stack key={id}>{name}</Stack>;
        })}
      </Stack>
    </Box>
  );
};

export default RegionTabContent;
