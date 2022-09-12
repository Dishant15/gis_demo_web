import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, IconButton, Paper, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import TicketWorkOrderList from "./components/TicketWorkOrderList";
import TicketSideBarDummyLoading from "./components/TicketSideBarDummyLoading";

import { fetchTicketWorkorderDataThunk } from "planning/data/ticket.services";
import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { getPlanningPage } from "utils/url.constants";

/**
 * Parent
 *  PlanningPage
 */
const TicketSideBar = React.memo(({ ticketId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ticketData = useSelector(getPlanningTicketData);
  const { isLoading, isError, name, work_orders } = ticketData;
  // fetch ticket details
  useEffect(() => {
    dispatch(fetchTicketWorkorderDataThunk(ticketId));
  }, [ticketId]);

  const handleCloseTicketSideBar = useCallback(() => {
    navigate(getPlanningPage());
  }, []);

  if (isLoading) {
    return <TicketSideBarDummyLoading />;
  }
  if (isError) {
    return (
      <Box>
        <Typography variant="h5">Error occured while fetching data</Typography>
      </Box>
    );
  }

  return (
    <Paper className="ticket-sidebar-wrapper">
      <Stack
        sx={{ backgroundColor: "primary.dark", color: "background.paper" }}
        direction="row"
        width="100%"
      >
        <Typography className="ticket-sidebar-heading" variant="h5">
          {name}
        </Typography>

        <IconButton
          onClick={handleCloseTicketSideBar}
          sx={{ color: "#ffffff73" }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <Box className="ticket-sidebar-content">
        <TicketWorkOrderList workOrderList={work_orders} />
      </Box>
    </Paper>
  );
});

export default TicketSideBar;
