import React from "react";
import { get, noop, size } from "lodash";

import { Box, Collapse, Divider, IconButton, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import { getFillColor } from "utils/map.utils";

const RegionListItem = ({
  region,
  regionGroupData,
  selectedRegion,
  expandedRegions,
  handleRegionClick,
  handleRegionDetails,
  handleRegionExpandClick,
  canUserEditRegion,
}) => {
  const { id, center, name, layer } = region;
  const color = getFillColor(layer);
  const isActive = selectedRegion.has(id);
  // check if childs are open
  const regionChilds = get(regionGroupData, id, []);
  const hasChildren = !!size(regionChilds);
  const isExpanded = hasChildren && expandedRegions.has(id);
  const borderLeft = isExpanded ? `1px solid ${color}` : null;

  return (
    <Box className="reg-list-pill" sx={{ borderLeft }}>
      <Stack direction="row" width="100%" spacing={2}>
        <Box
          sx={{ opacity: hasChildren ? 1 : 0.3 }}
          onClick={hasChildren ? handleRegionExpandClick(id, center) : noop}
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
          onClick={() => handleRegionClick(id, center)}
        >
          <span>{name}</span>
          {isActive ? <VisibilityIcon /> : null}
        </Stack>
        {canUserEditRegion ? (
          <Box onClick={() => handleRegionDetails(id)}>
            <IconButton aria-label="add-area-pocket" size="small">
              <FormatListBulletedIcon color="inherit" />
            </IconButton>
          </Box>
        ) : null}
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
                handleRegionDetails={handleRegionDetails}
                handleRegionExpandClick={handleRegionExpandClick}
              />
            );
          })}
        </>
      </Collapse>
    </Box>
  );
};

export default RegionListItem;
