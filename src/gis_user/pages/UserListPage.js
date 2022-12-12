import React, { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { AgGridReact } from "ag-grid-react";

import find from "lodash/find";
import split from "lodash/split";
import filter from "lodash/filter";
import difference from "lodash/difference";

import { format } from "date-fns";

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
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import LoadingButton from "@mui/lab/LoadingButton";

import FilePickerDialog from "components/common/FilePickerDialog";
import ActiveUserCount from "gis_user/components/ActiveUserCount";

import {
  fetchApplicationList,
  fetchExportUser,
  fetchUserList,
  importUser,
} from "../data/services";
import { getAddUserPage, getEditUserPage } from "utils/url.constants";
import {
  checkUserPermission,
  getIsSuperAdminUser,
  getLoggedUserDetails,
} from "redux/selectors/auth.selectors";
import { addNotification } from "redux/reducers/notification.reducer";
import { parseErrorMessagesWithFields } from "utils/api.utils";

/**
 * Parent:
 *    App
 */
const UserListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canUserAdd = useSelector(checkUserPermission("user_add"));
  const canUserEdit = useSelector(checkUserPermission("user_edit"));
  const canUserDownload = useSelector(checkUserPermission("user_download"));
  const isSuperAdminUser = useSelector(getIsSuperAdminUser);
  const loggedInUser = useSelector(getLoggedUserDetails);

  const [showImportPopup, setShowImportPopup] = useState(false);

  const { isLoading, data, refetch } = useQuery("userList", fetchUserList, {
    select: (users) => {
      // no need to filter if user is super admin
      if (isSuperAdminUser) return users;
      // else compare and get all users having less region access than logged user
      return filter(users, (user) => {
        const hasRegion = !!user.regions.length;
        const userHasMorePerms = !difference(user.regions, loggedInUser.regions)
          .length;
        return hasRegion && userHasMorePerms;
      });
    },
  });

  const { isLoading: applicationLoading, data: applicationList } = useQuery(
    "applicationList",
    fetchApplicationList
  );

  const { mutate: exportUserMutation, isLoading: loadingExportUser } =
    useMutation(fetchExportUser, {
      onSuccess: (res) => {
        const report_name =
          "user_list" +
          "_" +
          format(new Date(), "dd/MM/yyyy") +
          "_" +
          format(new Date(), "hh:mm");

        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${report_name}.xlsx`);
        // have to add element to doc for firefox
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
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

  const { mutate: importUserMutation, isLoading: loadingImportuser } =
    useMutation(importUser, {
      onError: (err) => {
        handleFilePickerCancel();
        const { fieldList, messageList } = parseErrorMessagesWithFields(err);
        for (let index = 0; index < fieldList.length; index++) {
          const field = fieldList[index];
          const errorMessage = messageList[index];
          dispatch(
            addNotification({
              type: "error",
              title: field,
              text: errorMessage,
            })
          );
        }
      },
      onSuccess: (res) => {
        handleFilePickerCancel();
        let type = "success";
        let text = "";
        if (res.success_count) {
          text = res.success_count + " Users created.";
        }
        if (res.error_count) {
          type = "warning";
          text = `${text} ${res.error_count} user data is invalid.`;
        }
        if (!text) {
          type = "info";
          text = "User details updated successfully.";
        }
        dispatch(
          addNotification({
            type,
            title: "Upload Excel",
            text,
            timeout: 10000,
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
        <Box flex={1} flexDirection="row" display="flex" alignItems="baseline">
          <Typography className="dtl-title" variant="h5">
            User Management&nbsp;
          </Typography>
          <ActiveUserCount />
        </Box>
        {isSuperAdminUser || canUserDownload ? (
          <LoadingButton
            color="secondary"
            startIcon={<CloudDownloadIcon />}
            onClick={exportUserMutation}
            sx={{ ml: 1 }}
            loading={loadingExportUser}
          >
            Export Excel
          </LoadingButton>
        ) : null}
        {canUserAdd ? (
          <>
            {isSuperAdminUser ? (
              <LoadingButton
                color="secondary"
                startIcon={<BackupIcon />}
                onClick={() => setShowImportPopup(true)}
                sx={{ ml: 1 }}
              >
                Upload Excel
              </LoadingButton>
            ) : null}
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
              width: 100,
              className: "center",
            },
            {
              field: "is_staff",
              headerName: "Admin",
              cellRenderer: TickCell,
              width: 100,
              className: "center",
            },
            {
              field: "role.name",
              headerName: "Role",
            },
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
            loading={loadingImportuser}
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
