import React from "react";
import { get, size } from "lodash";

import { styled } from "@mui/material/styles";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListOffOutlinedIcon from "@mui/icons-material/FilterListOffOutlined";

import { getFillColor } from "utils/map.utils";

const RegionListItem = ({
  region,
  regionGroupData,
  selectedRegion,
  editRegionData,
  expandedRegions,
  handleRegionClick,
  startEditRegion,
  handleRegionCreate,
  handleRegionExpandClick,
}) => {
  const { id, name, layer } = region;
  const color = getFillColor(layer);
  const isActive = selectedRegion.has(id);
  const isEdit = editRegionData?.id === id;
  // check if childs are open
  const regionChilds = get(regionGroupData, id, []);
  const isExpanded = !!size(regionChilds) && expandedRegions.has(id);

  return (
    <Box className={`reg-list-pill`}>
      <Stack direction="row" width="100%" spacing={2}>
        <Stack direction="row" width="100%" spacing={2}>
          <Box sx={{ minWidth: "15px", backgroundColor: color }}></Box>
          <Box
            flex={1}
            sx={{
              color: isActive ? "secondary.main" : "inherit",
            }}
          >
            {name}
          </Box>
          <Box onClick={() => handleRegionClick(id)}>
            <IconButton aria-label="add-area-pocket" size="small">
              <VisibilityIcon color={isActive ? "secondary" : "inherit"} />
            </IconButton>
          </Box>
          <Box onClick={startEditRegion(region)}>
            <IconButton aria-label="add-area-pocket" size="small">
              <EditIcon color={isEdit ? "secondary" : "inherit"} />
            </IconButton>
          </Box>
          <Box onClick={handleRegionCreate(id)}>
            <IconButton aria-label="add-area-pocket" size="small">
              <AddIcon color="success" />
            </IconButton>
          </Box>
        </Stack>
        {!!size(regionChilds) ? (
          <Box onClick={handleRegionExpandClick(id)}>
            <ExpandMore
              expand={isExpanded}
              aria-expanded={isExpanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Box>
        ) : (
          <Box>
            <IconButton aria-label="add-area-pocket" size="small">
              <FilterListOffOutlinedIcon color="inherit" />
            </IconButton>
          </Box>
        )}
      </Stack>

      <Divider flexItem />

      {isExpanded
        ? regionChilds.map((regionChild) => {
            return (
              <RegionListItem
                key={regionChild.id}
                region={regionChild}
                regionGroupData={regionGroupData}
                selectedRegion={selectedRegion}
                editRegionData={editRegionData}
                expandedRegions={expandedRegions}
                handleRegionClick={handleRegionClick}
                startEditRegion={startEditRegion}
                handleRegionCreate={handleRegionCreate}
                handleRegionExpandClick={handleRegionExpandClick}
              />
            );
          })
        : null}
    </Box>
  );
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default RegionListItem;
