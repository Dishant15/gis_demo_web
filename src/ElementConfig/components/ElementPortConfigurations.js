import React from "react";
import { useQuery } from "react-query";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { fetchElementPortConfigList } from "ElementConfig/data/services";

const ElementPortConfigurations = ({ data, onClose }) => {
  const { layerKey, elementId } = data;

  const { isLoading, data: portConfigData } = useQuery(
    [layerKey, elementId],
    fetchElementPortConfigList
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        <div />
        <Typography variant="h6" color="primary.dark">
          Element Port Configurations
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        dividers
        sx={{
          padding: 0,
          height: "502px",
        }}
      >
        {isLoading ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <Box>
            <CablePortConfigTable portConfigList={portConfigData} />
          </Box>
        )}
      </DialogContent>
    </>
  );
};

export default ElementPortConfigurations;

const CablePortConfigTable = ({ portConfigList }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sr No</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Tube Color</TableCell>
            <TableCell align="right">Fiber Color</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {portConfigList.map((portConfig) => {
            const { fiber_color } = portConfig;

            const isDash = fiber_color.includes("d-");
            const currFibColor = fiber_color.includes("d-")
              ? fiber_color.substring(2)
              : fiber_color;
            return (
              <TableRow
                key={portConfig.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {portConfig.sr_no}
                </TableCell>
                <TableCell align="right">{portConfig.name}</TableCell>
                <TableCell
                  sx={{
                    backgroundColor: portConfig.tube_color,
                    color: "white",
                  }}
                  align="right"
                >
                  {portConfig.tube_color}
                </TableCell>
                <TableCell sx={{ backgroundColor: currFibColor }} align="right">
                  {portConfig.fiber_color}
                </TableCell>
                <TableCell align="right">{portConfig.carbs}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
