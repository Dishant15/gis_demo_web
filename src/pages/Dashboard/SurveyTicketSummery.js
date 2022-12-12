/**
 * DEPRECATED NOT USED ANY MORE
 * Delete after updating Ticket list page same as this grid
 */

import React, { useRef } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { fetchDashSurveySummery } from "pages/dashboard.service";
import {
  getPlanningTicketPage,
  getTicketWorkorderPage,
} from "utils/url.constants";

const SurveyTicketSummery = () => {
  const gridRef = useRef();
  const navigate = useNavigate();

  const { data: summeryData = { ticket_list: [] } } = useQuery(
    "surveyTicketSummery",
    fetchDashSurveySummery,
    {
      staleTime: 5 * 60000, // 5 minutes
    }
  );

  const onGridReady = () => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const onViewClick = ({ id, ticket_type }) => {
    if (ticket_type === "P") {
      navigate(getPlanningTicketPage(id));
    } else {
      navigate(getTicketWorkorderPage(id));
    }
  };

  return (
    <Stack my={2}>
      <Paper p={3} className="ag-theme-alpine" width="100%">
        <Typography variant="h5" p={1} color="primary.main">
          Survey Ticket Summery
        </Typography>
        <AgGridReact
          ref={gridRef}
          rowData={summeryData.ticket_list}
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
              valueFormatter: (data) => {
                if (data.value) {
                  return format(new Date(data.value), "dd/MM/yy");
                }
                return "";
              },
            },
            {
              field: "status",
              headerName: "Status",
              valueFormatter: (data) => {
                if (data.value === "A") {
                  return "Active";
                } else if (data.value === "C") {
                  return "Completed";
                } else if (data.value === "I") {
                  return "In Active";
                }
                return "";
              },
            },
            {
              field: "today_workorders",
              headerName: "Workorder created today",
            },
            {
              field: "today_homepass",
              headerName: "Home pass added today",
            },
            {
              field: "submited_workorders",
              headerName: "Submitted",
            },
            {
              field: "rejected_workorders",
              headerName: "Rejected",
            },
            {
              field: "approved_workorders",
              headerName: "Approved",
            },
            {
              field: "total_workorders",
              headerName: "Total WO",
            },
            {
              field: "total_home_pass",
              headerName: "Total HP",
            },
            {
              headerName: "Action",
              field: "id",
              width: 80,
              cellRenderer: ActionCell,
              cellRendererParams: {
                onViewClick,
              },
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
      </Paper>
    </Stack>
  );
};

const ActionCell = (props) => {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        aria-label="details"
        onClick={() => props.onViewClick(props.data)}
      >
        <VisibilityIcon />
      </IconButton>
    </Stack>
  );
};

export default SurveyTicketSummery;
