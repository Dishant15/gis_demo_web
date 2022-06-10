import React, { useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, Stack, Typography, Divider, Tab, Tabs } from "@mui/material";

import { getTicketListPage } from "utils/url.constants";
import { useQuery } from "react-query";
import { fetchTicketDetails } from "ticket/data/services";
import AddTicketForm from "ticket/components/AddTicketForm";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TicketEditPage = () => {
  const { ticketId } = useParams();

  // get ticket data
  const { isLoading, data: ticketData } = useQuery(
    ["ticketDetails", ticketId],
    fetchTicketDetails
  );
  console.log(
    "🚀 ~ file: TicketEditPage.js ~ line 15 ~ TicketEditPage ~ ticketData",
    ticketData
  );

  // show tabs handle tab change logic
  const [tab, setTab] = React.useState(0);
  const handleChange = useCallback((event, newValue) => {
    setTab(newValue);
  }, []);

  return (
    <Stack>
      <Stack p={2} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          Edit Ticket
        </Typography>
      </Stack>

      <Divider flexItem />

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100%",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tab}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Map" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <AddTicketForm formData={ticketData} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          Map
        </TabPanel>
      </Box>
    </Stack>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
export default TicketEditPage;
