import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import get from "lodash/get";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import ViewListIcon from "@mui/icons-material/ViewList";

import { getContentHeight } from "redux/selectors/appState.selectors";
import { fetchDashboardData } from "../dashboard.service";
import { getTicketListPage } from "utils/url.constants";
import {
  checkUserPermission,
  getIsAdminUser,
  getIsSuperAdminUser,
} from "redux/selectors/auth.selectors";

const HomePage = () => {
  const contentHeight = useSelector(getContentHeight);
  const canUserView = useSelector(checkUserPermission("user_view"));
  const isAdminUser = useSelector(getIsAdminUser);
  const isSuperAdminUser = useSelector(getIsSuperAdminUser);

  const canView = canUserView || isAdminUser || isSuperAdminUser;

  const { data } = useQuery("dashboardData", fetchDashboardData, {
    staleTime: 5 * 60000, // 5 minutes
  });

  return (
    <Box sx={{ height: contentHeight, p: 2, pb: 5 }}>
      <Container>
        <Stack direction="row" spacing={2}>
          <Card sx={{ minWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Active Tickets
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
                {get(data, "ticket_count", "----")}
              </Box>
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
                {get(data, "user_count", "----")}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
