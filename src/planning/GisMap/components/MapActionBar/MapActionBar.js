import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import size from "lodash/size";
import isNumber from "lodash/isNumber";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import StopCircleIcon from "@mui/icons-material/StopCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PanToolIcon from "@mui/icons-material/PanTool";

import {
  getMapHighlighted,
  getPlanningMapFilters,
  getTicketMapHighlighted,
} from "planning/data/planningGis.selectors";
import {
  resetFilters,
  resetMapHighlight,
  resetTicketMapHighlight,
  setFilter,
} from "planning/data/planningGis.reducer";

import "planning/styles/map-actionbar.scss";
import { LAYER_STATUS_OPTIONS } from "planning/GisMap/layers/common/configuration";

/**
 * Parent:
 *    GisMap
 */
const MapActionBar = () => {
  const dispatch = useDispatch();
  const mapHighlight = useSelector(getMapHighlighted);
  const ticketMapHighlight = useSelector(getTicketMapHighlighted);

  const handleResetHighlight = useCallback((e) => {
    e.preventDefault();
    dispatch(resetMapHighlight());
  }, []);

  const handleResetTicketHighlight = useCallback((e) => {
    e.preventDefault();
    dispatch(resetTicketMapHighlight());
  }, []);

  return (
    <Box position="absolute" top={60} left={10} className="map-actionbar">
      <Tooltip title="Near by elements" placement="right">
        <Box className="icon-button" onClick={() => {}} mb={1}>
          <PanToolIcon />
        </Box>
      </Tooltip>
      {!!size(mapHighlight) ? (
        <Tooltip title="Stop Highlight" placement="right">
          <Box className="icon-button" onClick={handleResetHighlight} mb={1}>
            <StopCircleIcon />
          </Box>
        </Tooltip>
      ) : null}
      {isNumber(ticketMapHighlight) ? (
        <Tooltip title="Stop Highlight" mb={1} placement="right">
          <Box className="icon-button" onClick={handleResetTicketHighlight}>
            <StopCircleIcon />
          </Box>
        </Tooltip>
      ) : null}
      <LayerStatusFilter />
    </Box>
  );
};

const LayerStatusFilter = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleShow = useCallback((e) => {
    setAnchorEl(e.target);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <FilterBlock onClose={handleClose} />
      </Popover>
      <Tooltip title="Filter" mb={1} placement="right">
        <Box className="icon-button" onClick={handleShow}>
          <FilterAltIcon className="no-click" />
        </Box>
      </Tooltip>
    </>
  );
};

const FilterBlock = ({ onClose }) => {
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();
  const appliedFilters = useSelector(getPlanningMapFilters);
  // set redux filter to internal state
  useEffect(() => {
    if (appliedFilters.status) {
      setStatus(appliedFilters.status);
    }
  }, [appliedFilters]);

  const handleChange = useCallback((event) => {
    const { name, checked } = event.target;
    setStatus(checked ? name : null);
  }, []);

  const handleReset = useCallback((event) => {
    event.preventDefault();
    dispatch(resetFilters());
    onClose();
  }, []);

  const handleApply = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(
        setFilter({
          filterKey: "status",
          filterValue: status,
        })
      );
      onClose();
    },
    [status]
  );

  return (
    <Box p={1}>
      <Box p={1}>
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Status</FormLabel>
          <FormGroup>
            {LAYER_STATUS_OPTIONS.map((ops) => {
              return (
                <FormControlLabel
                  key={ops.value}
                  control={
                    <Checkbox
                      checked={status === ops.value}
                      onChange={handleChange}
                      name={ops.value}
                    />
                  }
                  label={ops.label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Box>
      <Stack flexDirection="row" justifyContent="space-between">
        <Button variant="outlined" color="error" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleApply}>
          Apply
        </Button>
      </Stack>
    </Box>
  );
};

export default memo(MapActionBar);
