import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import TicketWorkOrderList from "./components/TicketWorkOrderList";
import TicketSideBarDummyLoading from "./components/TicketSideBarDummyLoading";

import { fetchTicketWorkorderDataThunk } from "planning/data/ticket.services";
import { getPlanningTicketData } from "planning/data/planningGis.selectors";

/**
 * Parent
 *  PlanningPage
 */
const TicketSideBar = React.memo(({ ticketId }) => {
  const dispatch = useDispatch();
  const ticketData = useSelector(getPlanningTicketData);
  const { isLoading, name, work_orders } = ticketData;
  // fetch ticket details
  useEffect(() => {
    dispatch(fetchTicketWorkorderDataThunk(ticketId));
  }, [ticketId]);

  if (isLoading) {
    return <TicketSideBarDummyLoading />;
  }

  return (
    <Paper className="ticket-sidebar-wrapper">
      <Typography
        sx={{ backgroundColor: "primary.dark", color: "white" }}
        className="ticket-sidebar-heading"
        variant="h5"
      >
        {name}
      </Typography>

      <Box className="ticket-sidebar-content">
        <TicketWorkOrderList workOrderList={work_orders} />
      </Box>
    </Paper>
  );
});

export default TicketSideBar;
