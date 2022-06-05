import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import { useQuery } from "react-query";
import { fetchUserList } from "./data/services";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { getAddUserPage } from "utils/url.constants";

const columnDefs = [
  { field: "username" },
  { field: "name" },
  { field: "is_active" },
  { field: "is_staff" },
  { field: "access_ids" },
];

const UserListPage = () => {
  const { isLoading, data } = useQuery("regionList", fetchUserList);

  return (
    <Container
      maxWidth="lg"
      mt={2}
      sx={{ backgroundColor: "background.default", minHeight: "100vh" }}
    >
      <Paper elevation={0}>
        <Stack divider={<Divider flexItem />}>
          <Stack p={1} direction="row" spacing={2} width="100%">
            <Typography flex={1} className="dtl-title" variant="h5">
              Users
            </Typography>
            <Button
              sx={{ minWidth: "150px" }}
              component={Link}
              to={getAddUserPage()}
            >
              Add
            </Button>
          </Stack>

          <Box
            className="ag-theme-alpine"
            style={{ height: "100vh", width: "100%" }}
          >
            <AgGridReact rowData={data} columnDefs={columnDefs}></AgGridReact>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UserListPage;
