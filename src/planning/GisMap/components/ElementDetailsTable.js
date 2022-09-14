import React, { useCallback } from "react";
import { useQuery } from "react-query";
import get from "lodash/get";
import range from "lodash/range";

import {
  Divider,
  Stack,
  Typography,
  Skeleton,
  Chip,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

import GisMapPopups from "./GisMapPopups";

import { fetchElementDetails } from "planning/data/layer.services";
import { useDispatch, useSelector } from "react-redux";
import { setMapState } from "planning/data/planningGis.reducer";
import { PLANNING_EVENT } from "../utils";
import { getContentHeight } from "redux/selectors/appState.selectors";

/**
 * fetch element details
 * handle loading
 * show data in table form
 */
const ElementDetailsTable = ({
  rowDefs,
  layerKey,
  elementId,
  onEditDataConverter,
}) => {
  const dispatch = useDispatch();
  const { data: elemData, isLoading } = useQuery(
    ["elementDetails", layerKey, elementId],
    fetchElementDetails
  );

  const windowHeight = useSelector(getContentHeight);
  console.log(
    "🚀 ~ file: ElementDetailsTable.js ~ line 46 ~ windowHeight",
    windowHeight
  );
  // contentHeight = windowHeight - (10% margin * 2 top & bot) - (title + action btns)
  const contentHeight = windowHeight - windowHeight * 0.1 - (60 + 70);

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handleEditDetails = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementDetails,
        layerKey,
        data: onEditDataConverter(elemData),
      })
    );
  }, [dispatch, layerKey, elemData, onEditDataConverter]);

  const handleEditLocation = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementLocation,
        layerKey,
        data: { elementId: elemData.id, coordinates: elemData.coordinates },
      })
    );
  }, [dispatch, layerKey, elemData]);

  // show dummy loader for loading
  if (isLoading) return <ElemTableDummyLoader />;

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          p={1}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            Element Details
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* Button container */}
        <Stack
          sx={{ boxShadow: "0px 5px 7px -3px rgba(122,122,122,0.51)" }}
          p={2}
          direction="row"
          spacing={2}
        >
          <Button
            onClick={handleEditDetails}
            startIcon={<EditIcon />}
            variant="outlined"
            color="secondary"
          >
            Details
          </Button>
          <Button
            onClick={handleEditLocation}
            startIcon={<EditLocationAltIcon />}
            variant="outlined"
            color="secondary"
          >
            Location
          </Button>
        </Stack>
        {/* Table Content */}
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
                const color =
                  elemStatus === "V"
                    ? "success"
                    : elemStatus === "P"
                    ? "warning"
                    : "error";

                ValueCell = (
                  <Box textAlign="center" width={"50%"}>
                    <Chip
                      label={get(elemData, `${field}_display`)}
                      color={color}
                    />
                  </Box>
                );
                break;

              default:
                ValueCell = (
                  <Typography
                    sx={{ whiteSpace: "pre" }}
                    textAlign="center"
                    width={"50%"}
                  >
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
      </Box>
    </GisMapPopups>
  );
};

const ElemTableDummyLoader = () => {
  const rowPills = range(6);
  return (
    <GisMapPopups>
      <Stack>
        {rowPills.map((ind) => {
          return <Skeleton key={ind} animation="wave" height="30px" />;
        })}
      </Stack>
    </GisMapPopups>
  );
};

export default ElementDetailsTable;
