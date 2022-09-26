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
import DynamicForm from "components/common/DynamicForm";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

  const [age, setAge] = React.useState("");
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Container sx={{ height: contentHeight, py: 2 }}>
      {/* <Stack direction="row" spacing={2}>
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
      </Stack> */}

      <Stack my={2}>
        <Paper p={3}>
          <DynamicForm
            formConfigs={ELEMENT_FORM_TEMPLATE}
            data={INITIAL_ELEMENT_DATA}
            onSubmit={(res) => {
              console.log("🚀 ~ file: HomePage ~ res", res);
            }}
            isLoading={false}
          />
          <Stack p={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

const INITIAL_ELEMENT_DATA = {
  unique_id: "REG_DP_",
  // status: { value: "P", label: "Planned" },
  status: "",
  status2: "T,P",
};

const LAYER_STATUS_OPTIONS = [
  { value: "T", label: "Ticket Open" },
  { value: "P", label: "Planned" },
  { value: "V", label: "Verified" },
];

const LAYER_STATUS_OPTIONS_2 = [
  { id: "T", name: "Ticket Open" },
  { id: "P", name: "Planned" },
  { id: "V", name: "Verified" },
];

// this will become function -> generate From Configs
const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Distribution Point Form",
      fieldConfigs: [
        {
          field_key: "unique_id",
          label: "Unique Id",
          field_type: "input",
        },
        {
          field_key: "status",
          label: "Status",
          field_type: "select",
          options: LAYER_STATUS_OPTIONS,
        },
        {
          field_key: "status2",
          label: "Status 2",
          field_type: "selectCreatable",
          options: LAYER_STATUS_OPTIONS_2,
          labelKey: "name",
          valueKey: "id",
        },
      ],
    },
  ],
};
