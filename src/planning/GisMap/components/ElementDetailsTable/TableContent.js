import React from "react";
import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import get from "lodash/get";
import { format } from "date-fns";

import { getContentHeight } from "redux/selectors/appState.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

/**
 * Parent:
 *    ElementDetailsTable
 */
const TableContent = ({ layerKey, elemData }) => {
  const windowHeight = useSelector(getContentHeight);
  // contentHeight = windowHeight - (10% margin * 2 top & bot) - (title + action btns)
  const contentHeight = windowHeight - windowHeight * 0.1 - (60 + 70);

  const rowDefs = get(LayerKeyMappings, [layerKey, "elementTableFields"], []);

  return (
    <Stack
      sx={{
        maxHeight: `${contentHeight}px`,
        overflowY: "auto",
      }}
      divider={<Divider />}
    >
      {rowDefs.map((row) => {
        const { label, field, type } = row;
        let ValueCell;

        switch (type) {
          case "status":
            const elemStatus = get(elemData, field);
            if (!elemStatus) return null;
            const color =
              elemStatus === "RFS"
                ? "success"
                : elemStatus === "L1" || elemStatus === "L2"
                ? "warning"
                : "error"; // IA: In active

            ValueCell = (
              <Box textAlign="center" width={"50%"}>
                <Chip label={get(elemData, `${field}_display`)} color={color} />
              </Box>
            );
            break;

          case "boolean":
            const elemBoolData = get(elemData, field);

            ValueCell = (
              <Box textAlign="center" width={"50%"}>
                <IconButton color={elemBoolData ? "success" : "error"}>
                  {elemBoolData ? <CheckIcon /> : <ClearIcon />}
                </IconButton>
              </Box>
            );
            break;

          case "date":
            const dateVal = get(elemData, field);
            let formattedDate = "--";
            if (dateVal) {
              formattedDate = format(new Date(dateVal), "dd/MM/YYY");
            }

            ValueCell = (
              <Typography
                sx={{ whiteSpace: "pre" }}
                textAlign="center"
                width={"50%"}
              >
                {formattedDate}
              </Typography>
            );
            break;

          default:
            ValueCell = (
              <Typography textAlign="center" width={"50%"}>
                {get(elemData, field, "--") || "--"}
              </Typography>
            );
            break;
        }

        return (
          <Stack direction="row" key={field} p={2}>
            <Typography color="primary.main" textAlign="left" width={"50%"}>
              {label}
            </Typography>
            {ValueCell}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default TableContent;
