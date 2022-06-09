import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { Box, Stack, Typography, Button, Divider } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import { fetchTicketList } from "ticket/data/services";
import { getAddTicketPage } from "utils/url.constants";

const columnDefs = [
  { field: "unique_id" },
  { field: "name" },
  { field: "status" },
  { field: "network_type", headerName: "Network Type" },
  { field: "region.name", headerName: "Region" },
];

/**
 * Parent:
 *    App
 */
const TicketListPage = () => {
  const { isLoading, data } = useQuery("ticketList", fetchTicketList);
  const gridRef = useRef();

  const onGridReady = () => {
    gridRef.current.api.sizeColumnsToFit();
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
          Tickets
        </Typography>
        <Button
          sx={{ minWidth: "150px" }}
          component={Link}
          to={getAddTicketPage()}
        >
          Add
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
          columnDefs={columnDefs}
          onGridReady={onGridReady}
        />
      </Box>
    </Stack>
  );
};

export default TicketListPage;
