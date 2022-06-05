import React from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
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
    <Box sx={{ backgroundColor: "#efefef", minHeight: "100vh" }}>
      <div>
        <Typography className="dtl-title" variant="h5">
          Users
        </Typography>
        <Button component={Link} to={getAddUserPage()}>
          Add
        </Button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "100vh", width: "100%" }}
      >
        <AgGridReact rowData={data} columnDefs={columnDefs}></AgGridReact>
      </div>
    </Box>
  );
};

export default UserListPage;
