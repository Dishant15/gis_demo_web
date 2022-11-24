import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TicketWorkOrderList from "./components/TicketWorkOrderList";
import DummyLoader from "planning/GisMap/components/ElementDetailsTable/DummyLoader";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import TableHeader from "planning/GisMap/components/ElementDetailsTable/TableHeader";

import { fetchTicketWorkorderDataThunk } from "planning/data/ticket.services";
import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { getPlanningPage } from "utils/url.constants";

/**
 * Parent
 *  PlanningPage
 */
const TicketSideBar = React.memo(({ ticketId }) => {
  const [minimized, setMinimized] = useState(false);
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

  const handlePopupMinimize = useCallback(() => {
    setMinimized((value) => !value);
  }, [setMinimized]);

  if (isLoading) {
    return <DummyLoader />;
  }

  return (
    <GisMapPopups dragId="ticket-wo">
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <TableHeader
          title={name}
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseTicketSideBar}
        />
        {isError ? (
          <Box p={2}>
            <Typography variant="h5">
              Error occured while fetching data
            </Typography>
          </Box>
        ) : (
          <Box className="ticket-sidebar-content">
            <TicketWorkOrderList workOrderList={work_orders} />
          </Box>
        )}
      </Box>
    </GisMapPopups>
  );
});

export default TicketSideBar;
