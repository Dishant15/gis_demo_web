import React from "react";
import { range } from "lodash";

import { Box, Paper, Typography, Skeleton } from "@mui/material";

const TicketSideBarDummyLoading = () => {
  const ticketPills = range(6);
  return (
    <Paper className="ticket-sidebar-wrapper">
      <Typography
        sx={{ backgroundColor: "primary.dark", color: "white" }}
        className="ticket-sidebar-heading"
        variant="h5"
      >
        Loading...
      </Typography>

      <Box className="ticket-sidebar-content" sx={{ padding: "20px" }}>
        {ticketPills.map((ind) => {
          return <Skeleton key={ind} animation="wave" height="50px" />;
        })}
      </Box>
    </Paper>
  );
};

export default TicketSideBarDummyLoading;
