import React, { useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import {
  Box,
  Stack,
  Typography,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import TicketForm from "ticket/components/TicketForm";
import TicketEditMap from "ticket/components/TicketEditMap";

import { editTicket, fetchTicketDetails } from "ticket/data/services";
import { getTicketListPage } from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const TicketEditPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // get ticket data
  const { isLoading, data: ticketData } = useQuery(
    ["ticketDetails", ticketId],
    fetchTicketDetails
  );

  const { mutate: editTicketMutation, isLoading: isTicketEditing } =
    useMutation(editTicket, {
      onSuccess: (res) => {
        navigate(getTicketListPage());
        dispatch(
          addNotification({
            type: "success",
            title: "Ticket update",
            text: "Ticket updated successfully",
          })
        );
        queryClient.invalidateQueries("ticketDetails");
      },
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "Error",
            text: err.message,
          })
        );
      },
    });

  const handleSubmit = useCallback(
    (data) => {
      editTicketMutation({
        ticketId: ticketData.id,
        data: { ...data, regionCoords: undefined },
      });
    },
    [ticketData]
  );

  // show tabs handle tab change logic
  const [tab, setTab] = React.useState(0);
  const handleChange = useCallback((event, newValue) => {
    setTab(newValue);
  }, []);

  if (isLoading) {
    return (
      <Box p={2}>
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  return (
    <Stack height="100%">
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
          height: "calc(100% - 4em)",
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
        <TabPanel
          value={tab}
          index={0}
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <TicketForm
            formData={ticketData}
            isEdit={true}
            handleFormSubmit={handleSubmit}
            formCancelButton={
              <Button
                variant="outlined"
                color="error"
                component={Link}
                to={getTicketListPage()}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
            }
            formActionProps={{
              p: 4,
              justifyContent: "space-between",
            }}
            formSubmitButtonProps={{
              variant: "outlined",
              color: "success",
              endIcon: <ArrowForwardIosIcon />,
            }}
            formSubmitButtonText="Update"
            isButtonLoading={isTicketEditing}
          />
        </TabPanel>
        <TabPanel
          value={tab}
          index={1}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <TicketEditMap ticketData={ticketData} />
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
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && (
        <Box height="100%" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};
export default TicketEditPage;
