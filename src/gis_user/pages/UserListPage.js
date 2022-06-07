import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { Box, Stack, Typography, Button, Divider } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import { fetchUserList } from "../data/services";
import { getAddUserPage } from "utils/url.constants";

const columnDefs = [
  { field: "username" },
  { field: "name" },
  { field: "is_active", headerName: "Active" },
  { field: "is_staff", headerName: "Admin" },
  { field: "access_names", headerName: "Access" },
];

/**
 * Parent:
 *    App
 */
const UserListPage = () => {
  const { isLoading, data } = useQuery("userList", fetchUserList);

  return (
    <>
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
          p={2}
          className="ag-theme-alpine"
          style={{ height: "100vh", width: "100%" }}
        >
          <AgGridReact rowData={data} columnDefs={columnDefs}></AgGridReact>
        </Box>
      </Stack>
    </>
  );
};

export default UserListPage;
