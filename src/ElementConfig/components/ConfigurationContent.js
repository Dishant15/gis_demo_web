import React, { useCallback, useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";

import { get } from "lodash";

import { AgGridReact } from "ag-grid-react";
import TicketListDummyLoader from "ticket/components/TicketListDummyLoader";
import DynamicForm from "components/common/DynamicForm";

import {
  deleteElementConfig,
  fetchElementList,
  upsertElementConfig,
} from "ElementConfig/data/services";
import { LayerKeyMappings } from "planning/GisMap/utils";
import {
  ActionCell,
  SelectValueCell,
} from "components/common/AgGridCustomCells";
import ElementPortConfigurations from "./ElementPortConfigurations";

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
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
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
        queryClient.invalidateQueries("planningLayerConfigsDetails");
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
        queryClient.invalidateQueries("planningLayerConfigsDetails");
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
    setShowForm(layerKey);
    setFormData(null);
  };

  const onEditClick = (data) => {
    setFormData(data);
    setShowForm(layerKey);
  };

  const onViewClick = (data) => {
    setFormData({ elementId: data.id, layerKey });
    setShowDetails(layerKey);
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
    setShowForm(null);
    setShowDetails(null);
    setFormData(null);
  }, []);

  const mayRenderFormDialog = useMemo(() => {
    return (
      <Dialog onClose={handleFormClose} open={!!showForm}>
        {!!showForm ? (
          <DynamicForm
            formConfigs={LayerKeyMappings[layerKey]["ConfigFormTemplate"]}
            data={formData || LayerKeyMappings[layerKey]["ConfigInitData"]}
            onSubmit={upsertElementConfigMutation}
            onCancel={handleFormClose}
            isLoading={upsertElementConfigLoading}
          />
        ) : null}
      </Dialog>
    );
  }, [
    showForm,
    formData,
    layerKey,
    upsertElementConfigLoading,
    handleFormClose,
    upsertElementConfigMutation,
  ]);

  const mayRenderElementDetailsDialog = useMemo(() => {
    return (
      <Dialog onClose={handleFormClose} open={!!showDetails}>
        {!!showDetails ? (
          <ElementPortConfigurations
            data={formData}
            onClose={handleFormClose}
          />
        ) : null}
      </Dialog>
    );
  }, [showDetails, formData, handleFormClose]);

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
              ...LayerKeyMappings[layerKey]["TableColDefs"],
              {
                headerName: "Action",
                field: "id",
                maxWidth: 166,
                cellRenderer: ActionCell,
                cellRendererParams: {
                  onEditClick,
                  onDeleteClick,
                  onViewClick,
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
      {mayRenderFormDialog}
      {mayRenderElementDetailsDialog}
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
              <LoadingButton
                onClick={onDeleteConfirm}
                autoFocus
                loading={deleteElementLoading}
                color="error"
              >
                Delete
              </LoadingButton>
              <Button onClick={handleDeleteClose}>Cancel</Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Stack>
  );
};

export default ConfigurationContentWrapper;
