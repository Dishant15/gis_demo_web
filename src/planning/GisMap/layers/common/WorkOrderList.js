import React, { useCallback } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";

import { Stack, Typography, Box, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import { ElemTableDummyLoader } from "planning/GisMap/components/ElementDetailsTable";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { getContentHeight } from "redux/selectors/appState.selectors";
import { fetchTicketWorkorders } from "ticket/data/services";
import { setMapState } from "planning/data/planningGis.reducer";

/**
 * Parent:
 *  layers > ticket > LayerComponents
 */
const WorkOrderList = () => {
  const dispatch = useDispatch();

  const windowHeight = useSelector(getContentHeight);
  const data = useSelector(getPlanningMapStateData);
  const ticketId = get(data, "elementId");
  // contentHeight = windowHeight - (10% margin * 2 top & bot) - (title + action btns)
  const contentHeight = windowHeight - windowHeight * 0.1 - (60 + 70);

  const { isLoading, data: ticketData } = useQuery(
    ["ticketWorkOrderList", ticketId],
    fetchTicketWorkorders,
    {
      enabled: !!ticketId,
    }
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  // show dummy loader for loading
  if (isLoading) return <ElemTableDummyLoader />;

  const workOrders = get(ticketData, "work_orders", []);

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          p={1}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            {ticketData.name} Workorders
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* Table Content */}
        <Stack
          sx={{
            maxHeight: `${contentHeight}px`,
            overflowY: "auto",
          }}
          divider={<Divider />}
        >
          {workOrders.length ? (
            workOrders.map((item) => {
              return (
                <Typography variant="caption" key={item.id}>
                  {item.layer_key}
                </Typography>
              );
            })
          ) : (
            <Typography variant="h4">no workorders</Typography>
          )}
        </Stack>
      </Box>
    </GisMapPopups>
  );
};

export default WorkOrderList;
