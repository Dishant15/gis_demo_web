import React, { useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { format } from "date-fns";

import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Add } from "@mui/icons-material";

import { AgGridReact } from "ag-grid-react";
import TicketListDummyLoader from "ticket/components/TicketListDummyLoader";
import TicketSummeryDownload from "ticket/components/TicketSummeryDownload";

import { fetchTicketSummeryList } from "ticket/data/services";
import {
  getAddTicketPage,
  getEditTicketPage,
  getPlanningTicketPage,
  getTicketWorkorderPage,
} from "utils/url.constants";
import { checkUserPermission } from "redux/selectors/auth.selectors";

/**
 * Parent:
 *    App
 */
const TicketListPage = () => {
  const navigate = useNavigate();
  const canTicketAdd = useSelector(checkUserPermission("ticket_add"));
  const canTicketEdit = useSelector(checkUserPermission("ticket_edit"));
  const canTicketWorkorderView = useSelector(
    checkUserPermission("ticket_workorder_view")
  );

  // const { isLoading, data } = useQuery("ticketList", fetchTicketList);
  const { isLoading, data } = useQuery(
    "ticketSummeryList",
    fetchTicketSummeryList,
    {
      staleTime: Infinity,
    }
  );

  const gridRef = useRef();

  const onGridReady = () => {
    // gridRef.current.api.sizeColumnsToFit();
  };

  const onEditClick = (ticketId) => {
    navigate(getEditTicketPage(ticketId));
  };

  const onViewClick = (ticketId, ticketType) => {
    if (ticketType === "P") {
      navigate(getPlanningTicketPage(ticketId));
    } else {
      navigate(getTicketWorkorderPage(ticketId));
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      filter: "agTextColumnFilter",
      resizable: true,
      sortable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  return (
    <Stack height="100%" divider={<Divider flexItem />}>
      <Stack
        px={2}
        py={1}
        direction="row"
        spacing={2}
        width="100%"
        alignItems="center"
      >
        <Typography flex={1} className="dtl-title" variant="h5">
          Tickets
        </Typography>
        <TicketSummeryDownload />
        {canTicketAdd ? (
          <Button
            variant="outlined"
            sx={{ minWidth: "150px" }}
            component={Link}
            to={getAddTicketPage()}
            startIcon={<Add />}
          >
            Add New Ticket
          </Button>
        ) : null}
      </Stack>

      {isLoading ? (
        <TicketListDummyLoader />
      ) : (
        <Box p={2} className="ag-theme-alpine" height="100%" width="100%">
          <AgGridReact
            ref={gridRef}
            rowData={data}
            defaultColDef={defaultColDef}
            paginationAutoPageSize={true}
            pagination={true}
            columnDefs={[
              {
                field: "assignee.name",
                headerName: "Assignee",
              },
              {
                field: "region.name",
                headerName: "Region",
              },
              {
                field: "name",
                headerName: "Name",
              },
              {
                field: "created_on",
                headerName: "Created On",
                width: 130,
                valueFormatter: (data) => {
                  if (data.value) {
                    return format(new Date(data.value), "dd/MM/yy");
                  }
                  return "";
                },
              },
              {
                field: "due_date",
                headerName: "Due Date",
                width: 120,
                valueFormatter: (data) => {
                  if (data.value) {
                    return format(new Date(data.value), "dd/MM/yy");
                  }
                  return "";
                },
              },
              { field: "ticket_type_display", headerName: "Type", width: 114 },
              { field: "status", cellRenderer: StatusCell, width: 150 },
              {
                field: "network_type",
                headerName: "Network Type",
                width: 180,
                valueFormatter: (params) => {
                  if (params.value === "L1") {
                    return "L1 Design";
                  } else if (params.value === "L2") {
                    return "L2 Design";
                  } else if (params.value === "RFS") {
                    return "Ready For Service";
                  } else {
                    return "In Active";
                  }
                },
              },
              {
                field: "today_workorders",
                headerName: "Workorder created today",
                width: 130,
              },
              {
                field: "today_elements",
                headerName: "Homepass today",
                width: 110,
                valueFormatter: ({ value, data }) => {
                  if (data.ticket_type === "S") {
                    return value;
                  }
                  return "--";
                },
              },
              {
                field: "submited_workorders",
                headerName: "Submitted",
                width: 130,
              },
              {
                field: "rejected_workorders",
                headerName: "Rejected",
                width: 120,
              },
              {
                field: "approved_workorders",
                headerName: "Approved",
                width: 120,
              },
              {
                field: "total_workorders",
                headerName: "Total WO",
                width: 100,
              },
              {
                field: "element_count",
                headerName: "Total Homepass",
                width: 100,
                valueFormatter: ({ value, data }) => {
                  if (data.ticket_type === "S") {
                    return value;
                  }
                  return "--";
                },
              },
              {
                headerName: "Action",
                field: "unique_id",
                width: 130,
                cellRenderer: ActionCell,
                cellRendererParams: {
                  onEditClick,
                  onViewClick,
                  canTicketEdit,
                  canTicketWorkorderView,
                },
              },
            ]}
            onGridReady={onGridReady}
          />
        </Box>
      )}
    </Stack>
  );
};

/**
 * Render view and edit icons
 */
const ActionCell = ({
  canTicketWorkorderView,
  canTicketEdit,
  data,
  onViewClick,
  onEditClick,
}) => {
  return (
    <Stack direction="row" spacing={1}>
      {canTicketWorkorderView ? (
        <IconButton
          aria-label="view"
          color="primary"
          onClick={() => onViewClick(data.id, data.ticket_type)}
        >
          <VisibilityIcon />
        </IconButton>
      ) : null}
      {canTicketEdit ? (
        <IconButton
          aria-label="edit"
          color="secondary"
          onClick={() => onEditClick(data.id)}
        >
          <EditIcon />
        </IconButton>
      ) : null}
    </Stack>
  );
};

/**
 * Render Status Cell with colors
 */
const StatusCell = (props) => {
  let color, label;
  if (props.value === "A") {
    color = "warning";
    label = "Active";
  } else if (props.value === "I") {
    color = "error";
    label = "In Active";
  } else if (props.value === "C") {
    color = "success";
    label = "Completed";
  }
  return (
    <Chip
      color={color}
      size="small"
      label={label}
      sx={{
        minWidth: "86px",
      }}
    />
  );
};

export default TicketListPage;
