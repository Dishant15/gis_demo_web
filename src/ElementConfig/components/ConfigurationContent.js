import React, { useRef } from "react";
import { useQuery } from "react-query";

import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { AgGridReact } from "ag-grid-react";
import TicketListDummyLoader from "ticket/components/TicketListDummyLoader";

import { fetchElementList } from "ElementConfig/data/services";

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
  const { isLoading, data } = useQuery(
    ["configList", layerKey],
    fetchElementList
  );

  const gridRef = useRef();

  const onGridReady = () => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const onEditClick = (data) => {
    console.log(
      "🚀 ~ file: ConfigurationContent.js ~ line 89 ~ onEditClick ~ data",
      data
    );
  };

  const onDeleteClick = (elementId) => {
    console.log(
      "🚀 ~ file: ConfigurationContent.js ~ line 96 ~ onDeleteClick ~ elementId",
      elementId
    );
  };

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
        <Button sx={{ minWidth: "150px" }} startIcon={<AddIcon />}>
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
                width: 100,
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
            loading
          />
        </Box>
      )}
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
    props.onDeleteClick(props.data.id);
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
