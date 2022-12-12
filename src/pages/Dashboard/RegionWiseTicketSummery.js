import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import get from "lodash/get";
import size from "lodash/size";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import difference from "lodash/difference";
import orderBy from "lodash/orderBy";
import noop from "lodash/noop";

import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";

import DummyListLoader from "planning/ActionBar/components/DummyListLoader";

import { fetchDashSurveySummery } from "pages/dashboard.service";

const RegionWiseTicketSummery = () => {
  const { data: regionSummeryData, isLoading } = useQuery(
    "surveySummery",
    fetchDashSurveySummery,
    {
      staleTime: 5 * 60000, // 5 minutes
    }
  );

  const [expandedRegions, setExpandedRegions] = useState(new Set([]));

  const [regionGroupData, baseRegionList] = useMemo(() => {
    const regionInputList = regionSummeryData || [];
    // group data by parent
    let resultGroupData = groupBy(regionInputList, "parent");
    // get list of parent keys
    const keyList = Object.keys(resultGroupData).map((k) => {
      if (k === "null") return null;
      return Number(k);
    });
    // get all the parent key list that is not in regionInputList ; e.x. null, or other
    // get list of ids
    const idList = map(regionInputList, "id");
    // get difference on keyList and idList
    const mergeList = difference(keyList, idList);
    // concat list of all groups with unknown parents that is our base layer
    let baseRegionList = [];
    for (let mListInd = 0; mListInd < mergeList.length; mListInd++) {
      const rId = mergeList[mListInd];
      baseRegionList = baseRegionList.concat(resultGroupData[String(rId)]);
    }
    // order by layer
    baseRegionList = orderBy(
      baseRegionList,
      [(region) => region.name.toLowerCase()],
      ["asc"]
    );
    // return cancat list as first base list to render
    return [resultGroupData, baseRegionList];
  }, [regionSummeryData]);

  const handleRegionExpandClick = useCallback(
    (regId) => () => {
      setExpandedRegions((regionSet) => {
        let newSet = new Set(regionSet);
        if (newSet.has(regId)) {
          newSet.delete(regId);
        } else {
          newSet.add(regId);
        }
        return newSet;
      });
    },
    [setExpandedRegions]
  );

  return (
    <Stack my={2} pb={7}>
      <Paper p={3} className="ag-theme-alpine" width="100%">
        <Typography textAlign="center" variant="h5" p={1} color="primary.main">
          Survey Summery overview
        </Typography>
        <Divider />
        {isLoading ? (
          <Box p={3}>
            <DummyListLoader />
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Region</TableCell>
                <TableCell>WO Created Today</TableCell>
                <TableCell>HP Created Today</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Rejected</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>WO Total</TableCell>
                <TableCell>HP Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {baseRegionList.map((region) => {
                return (
                  <RegionSummeryItem
                    key={region.id}
                    region={region}
                    regionGroupData={regionGroupData}
                    expandedRegions={expandedRegions}
                    handleRegionExpandClick={handleRegionExpandClick}
                  />
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RegionSummeryItem = ({
  region,
  regionGroupData,
  expandedRegions,
  handleRegionExpandClick,
}) => {
  const {
    id,
    name,
    today_workorders,
    today_homepass,
    submited_wo,
    rejected_wo,
    approved_wo,
    total_home_pass,
  } = region;

  const total_workorders = submited_wo + rejected_wo + approved_wo;
  // check if childs are open
  const regionChilds = useMemo(() => {
    return orderBy(
      get(regionGroupData, id, []),
      [(region) => region.name.toLowerCase()],
      ["asc"]
    );
  }, [regionGroupData, id]);
  const hasChildren = !!size(regionChilds);
  const isExpanded = hasChildren && expandedRegions.has(id);

  return (
    <>
      <TableRow
        key={id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <StyledTableCell component="th" scope="row">
          <Stack direction="row" width="100%" alignItems="center">
            <Box
              sx={{
                opacity: hasChildren ? 1 : 0.3,
                borderLeft: isExpanded ? "3px solid black" : "inherit",
              }}
              onClick={hasChildren ? handleRegionExpandClick(id) : noop}
            >
              <ExpandMore
                expand={isExpanded}
                aria-expanded={isExpanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </Box>
            <span>{name}</span>
          </Stack>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {today_workorders}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {today_homepass}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {submited_wo}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {rejected_wo}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {approved_wo}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {total_workorders}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {total_home_pass}
        </StyledTableCell>
      </TableRow>

      {isExpanded
        ? regionChilds.map((regionChild) => {
            return (
              <RegionSummeryItem
                key={regionChild.id}
                region={regionChild}
                regionGroupData={regionGroupData}
                expandedRegions={expandedRegions}
                handleRegionExpandClick={handleRegionExpandClick}
              />
            );
          })
        : null}
    </>
  );
};

export default RegionWiseTicketSummery;
