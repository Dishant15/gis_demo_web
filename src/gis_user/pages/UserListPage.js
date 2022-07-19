import React, { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Add } from "@mui/icons-material";

import { AgGridReact } from "ag-grid-react";

import { fetchApplicationList, fetchUserList } from "../data/services";
import { getAddUserPage, getEditUserPage } from "utils/url.constants";
import { find, split } from "lodash";

/**
 * Parent:
 *    App
 */
const UserListPage = () => {
  const navigate = useNavigate();
  const { isLoading, data } = useQuery("userList", fetchUserList);
  const { isLoading: applicationLoading, data: applicationList } = useQuery(
    "applicationList",
    fetchApplicationList
  );

  const gridRef = useRef();

  const onGridReady = () => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const onEditClick = (userId) => {
    navigate(getEditUserPage(userId));
  };

  return (
    <Stack divider={<Divider flexItem />}>
      <Stack
        px={2}
        py={1}
        direction="row"
        spacing={2}
        width="100%"
        alignItems="center"
      >
        <Typography flex={1} className="dtl-title" variant="h5">
          User Management
        </Typography>
        <Button
          sx={{ minWidth: "150px" }}
          component={Link}
          to={getAddUserPage()}
          startIcon={<Add />}
        >
          Add New User
        </Button>
      </Stack>

      <Box
        p={2}
        className="ag-theme-alpine"
        style={{ height: "100vh", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={[
            { field: "username" },
            { field: "name" },
            {
              field: "is_active",
              headerName: "Active",
              cellRenderer: TickCell,
            },
            { field: "is_staff", headerName: "Admin", cellRenderer: TickCell },
            {
              field: "access_ids",
              headerName: "Access",
              cellRenderer: AccessIdCell,
              cellRendererParams: {
                applicationList,
              },
            },
            {
              headerName: "Action",
              field: "id",
              width: 100,
              cellRenderer: ActionCell,
              cellRendererParams: {
                onEditClick,
              },
              resizable: false,
            },
          ]}
          defaultColDef={{
            filter: "agTextColumnFilter",
            resizable: true,
            sortable: true,
          }}
          onGridReady={onGridReady}
        />
      </Box>
    </Stack>
  );
};

const TickCell = (props) => {
  return (
    <IconButton
      aria-label="check-icon"
      size="small"
      color={!!props.value ? "success" : "error"}
      disableRipple
    >
      <CheckCircleIcon fontSize="small" />
    </IconButton>
  );
};

/**
 * Render edit icon
 */
const ActionCell = (props) => {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        aria-label="edit"
        color="secondary"
        onClick={() => props.onEditClick(props.data.id)}
      >
        <EditIcon />
      </IconButton>
    </Stack>
  );
};

const AccessIdCell = (props) => {
  const applicationName = useMemo(() => {
    const appIds = props.value ? split(props.value, ",") : [];
    let names = "";
    for (let index = 0; index < appIds.length; index++) {
      const currentData = find(props.applicationList, [
        "id",
        Number(appIds[index]),
      ]);
      if (currentData) {
        if (names) {
          names += ", " + currentData.name;
        } else {
          names = currentData.name;
        }
      }
    }
    return names;
  }, [props.value, props.applicationList]);

  return <div>{applicationName}</div>;
};

export default UserListPage;
