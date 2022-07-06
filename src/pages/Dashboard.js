import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import ViewListIcon from "@mui/icons-material/ViewList";
import GroupIcon from "@mui/icons-material/Group";

import { getContentHeight } from "redux/selectors/appState.selectors";
import { fetchDashboardData } from "./dashboard.service";
import { getTicketListPage, getUserListPage } from "utils/url.constants";

export default function HomePage() {
  const contentHeight = useSelector(getContentHeight);

  const { data } = useQuery("dashboardData", fetchDashboardData, {
    initialData: {
      survey_ticket_count: "--",
      network_ticket_count: "--",
      client_ticket_count: "--",
      user_count: "----",
    },
  });

  return (
    <Container sx={{ height: contentHeight, py: 2 }}>
      <Stack direction="row" spacing={2}>
        <Card sx={{ minWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Active Tickets
            </Typography>
            <Stack spacing={1} divider={<Divider flexItem />}>
              <Typography variant="body2" textAlign="center">
                Survey{" "}
                <Box component="b" sx={{ color: "primary.main" }}>
                  {data.survey_ticket_count}
                </Box>
              </Typography>
              <Typography variant="body2" textAlign="center">
                Planing{" "}
                <Box component="b" sx={{ color: "primary.main" }}>
                  {data.network_ticket_count}
                </Box>
              </Typography>
              <Typography variant="body2" textAlign="center">
                Client:{" "}
                <Box component="b" sx={{ color: "primary.main" }}>
                  {data.client_ticket_count}
                </Box>
              </Typography>
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to={getTicketListPage()}
              color="secondary"
              size="small"
              startIcon={<ViewListIcon />}
            >
              View Ticket List
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ minWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Active User Count
            </Typography>

            <Box
              sx={{
                textAlign: "center",
                lineHeight: "94px",
                minHeight: "94px",
                fontSize: "3em",
                color: "primary.main",
              }}
              component="div"
            >
              {data.user_count}
            </Box>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to={getUserListPage()}
              color="secondary"
              size="small"
              startIcon={<GroupIcon />}
            >
              View User List
            </Button>
          </CardActions>
        </Card>
      </Stack>

      <Stack my={2}>
        <Paper p={3}>
          <Typography textAlign="center" variant="h5">
            User Activity Logs
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
