import React, { useCallback, useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";

import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";

import { get } from "lodash";

import { AgGridReact } from "ag-grid-react";
import TicketListDummyLoader from "ticket/components/TicketListDummyLoader";
import DynamicForm from "components/common/DynamicForm";
import {
  FORM_CONFIGS,
  INITIAL_DATA,
  onSubmit,
} from "planning/GisMap/layers/p_splitter";

import {
  deleteElementConfig,
  fetchElementList,
  upsertElementConfig,
} from "ElementConfig/data/services";

/**
 *
 * Wrapper component to show list / add content or empty message
 * Parent:
 *    ElementConfigPage
 *
 */
const ConfigurationContentWrapper = ({ layerKey }) => {
  return (
    <Container
      sx={{
        paddingTop: 3,
        paddingBottom: 3,
        height: "100%",
      }}
    >
      <Paper
        sx={{
          height: "100%",
        }}
      >
        {layerKey ? (
          <ConfigurationContent layerKey={layerKey} />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h5">Please select config type</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

/**
 * fetch list of config data
 * handle loading
 * handle add popup show / hide logic
 * handle edit popup show / hide logic
 *
 * Parent:
 *    ConfigurationContentWrapper
 *
 * Render:
 *    Add btn
 *    list - ag grid
 *    add / edit form
 *    delete dialog
 */
const ConfigurationContent = ({ layerKey }) => {
  const [showForm, setShowForm] = useState(false);
  const [showDialog, setshowDialog] = useState(false);
  const [formData, setFormData] = useState(null); // null for add, data for edit
  const gridRef = useRef();

  const { isLoading, data, refetch } = useQuery(
    ["configList", layerKey],
    fetchElementList
  );

  const {
    mutate: upsertElementConfigMutation,
    isLoading: upsertElementConfigLoading,
  } = useMutation(
    (mutationData) => upsertElementConfig(mutationData, layerKey),
    {
      onSuccess: () => {
        handleFormClose();
        refetch();
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  const { mutate: deleteElementMutation, isLoading: deleteElementLoading } =
    useMutation((mutationData) => deleteElementConfig(mutationData, layerKey), {
      onSuccess: () => {
        handleDeleteClose();
        refetch();
      },
      onError: () => {
        console.log("error");
      },
    });

  const onGridReady = () => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const onAddClick = () => {
    setShowForm(true);
    setFormData(null);
  };

  const onEditClick = (data) => {
    console.log(
      "🚀 ~ file: ConfigurationContent.js ~ line 89 ~ onEditClick ~ data",
      data
    );
    setFormData(data);
    setShowForm(true);
  };

  const onDeleteClick = (data) => {
    setshowDialog(true);
    setFormData(data);
  };

  const onDeleteConfirm = (data) => {
    deleteElementMutation(formData.id);
  };

  const handleDeleteClose = () => {
    setshowDialog(false);
    setFormData(null);
  };

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setFormData(null);
  }, []);

  return (
    <Stack divider={<Divider flexItem />} height="100%">
      <Stack
        px={2}
        py={1}
        direction="row"
        spacing={2}
        width="100%"
        alignItems="center"
      >
        <Typography flex={1} className="dtl-title" variant="h5">
          Configuration
        </Typography>
        <Button
          sx={{ minWidth: "150px" }}
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add Configuration
        </Button>
      </Stack>
      {isLoading ? (
        <TicketListDummyLoader />
      ) : (
        <Box
          p={2}
          className="ag-theme-alpine"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={[
              { field: "config_name" },
              { field: "ratio" },
              { field: "vendor" },
              {
                headerName: "Action",
                field: "id",
                maxWidth: 140,
                cellRenderer: ActionCell,
                cellRendererParams: {
                  onEditClick,
                  onDeleteClick,
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
      )}
      <Dialog onClose={handleFormClose} open={showForm}>
        {showForm ? (
          <DynamicForm
            formConfigs={FORM_CONFIGS}
            data={formData || INITIAL_DATA}
            onSubmit={upsertElementConfigMutation}
            onClose={handleFormClose}
            isLoading={upsertElementConfigLoading}
          />
        ) : null}
      </Dialog>
      <Dialog open={showDialog} onClose={handleDeleteClose}>
        {showDialog ? (
          <>
            <DialogTitle>Delete Configuration</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to delete configuration{" "}
                <b>{get(formData, "config_name")}</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClose}>Close</Button>
              <LoadingButton
                onClick={onDeleteConfirm}
                autoFocus
                loading={deleteElementLoading}
              >
                Submit
              </LoadingButton>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Stack>
  );
};

/**
 * Render edit icon
 */
const ActionCell = (props) => {
  const handleEdit = () => {
    props.onEditClick(props.data);
  };
  const handleDelete = () => {
    props.onDeleteClick(props.data);
  };
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="edit" color="secondary" onClick={handleEdit}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" color="error" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default ConfigurationContentWrapper;
