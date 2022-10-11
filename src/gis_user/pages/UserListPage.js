import React, { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Dialog,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Add, Backup as BackupIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";

import { AgGridReact } from "ag-grid-react";
import FilePickerDialog from "components/common/FilePickerDialog";

import {
  fetchApplicationList,
  fetchUserList,
  importUser,
} from "../data/services";
import { getAddUserPage, getEditUserPage } from "utils/url.constants";
import { find, split } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { checkUserPermission } from "redux/selectors/auth.selectors";
import { addNotification } from "redux/reducers/notification.reducer";

/**
 * Parent:
 *    App
 */
const UserListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canUserAdd = useSelector(checkUserPermission("user_add"));
  const canUserEdit = useSelector(checkUserPermission("user_edit"));
  const [showImportPopup, setShowImportPopup] = useState(false);

  const { isLoading, data, refetch } = useQuery("userList", fetchUserList);
  const { isLoading: applicationLoading, data: applicationList } = useQuery(
    "applicationList",
    fetchApplicationList
  );

  const { mutate: importUserMutation, isLoading: loadingImportuser } =
    useMutation(importUser, {
      onError: (err) => {
        console.log("🚀 ~ file: WorkOrderPage ~ err", err);
        dispatch(
          addNotification({
            type: "error",
            title: "Upload Excel",
            text: "Failed to upload excel file.",
          })
        );
      },
      onSuccess: (res) => {
        handleFilePickerCancel();
        dispatch(
          addNotification({
            type: "success",
            title: "Upload Excel",
            text: "User Excel uploaded successfully",
          })
        );
        refetch();
      },
    });

  const gridRef = useRef();

  const onGridReady = () => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const onEditClick = (userId) => {
    navigate(getEditUserPage(userId));
  };

  // file import logic
  const handleFilePickerCancel = useCallback(() => {
    setShowImportPopup(false);
  }, [setShowImportPopup]);

  const handleZipFileUpload = useCallback((files) => {
    console.log(
      "🚀 ~ file: UserListPage.js ~ line 60 ~ UserListPage ~ files",
      files
    );
    const data = new FormData();
    data.append("file", files[0], files[0].name);
    importUserMutation(data);
  }, []);

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
        {canUserAdd ? (
          <>
            <LoadingButton
              color="secondary"
              startIcon={<BackupIcon />}
              onClick={() => setShowImportPopup(true)}
              sx={{ ml: 1 }}
            >
              Upload Excel
            </LoadingButton>
            <Button
              sx={{ minWidth: "150px" }}
              component={Link}
              to={getAddUserPage()}
              startIcon={<Add />}
            >
              Add New User
            </Button>
          </>
        ) : null}
      </Stack>

      <Box p={2} className="ag-theme-alpine" width="100%">
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
                canUserEdit,
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
          domLayout="autoHeight"
        />
      </Box>

      <Dialog
        onClose={handleFilePickerCancel}
        open={showImportPopup}
        scroll="paper" // used to scroll content into dialog
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        {showImportPopup ? (
          <FilePickerDialog
            onSubmit={handleZipFileUpload}
            onClose={handleFilePickerCancel}
            heading="Import User Excel"
            accept=".xlsx, .xls, .csv"
          />
        ) : null}
      </Dialog>
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
      {props.canUserEdit ? (
        <IconButton
          aria-label="edit"
          color="secondary"
          onClick={() => props.onEditClick(props.data.id)}
        >
          <EditIcon />
        </IconButton>
      ) : null}
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
