import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "react-query";

import {
  Stack,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import AddTicketForm from "ticket/components/AddTicketForm";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";

import { addNewTicket } from "ticket/data/services";
import { addNotification } from "redux/reducers/notification.reducer";
import { setMapState } from "planning/data/planningGis.reducer";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";

const TicketLayerForm = ({ isEdit, layerKey }) => {
  const dispatch = useDispatch();
  const data = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const { mutate, isLoading: isTicketAdding } = useMutation(addNewTicket, {
    onSuccess: (res) => {
      dispatch(
        addNotification({
          type: "success",
          title: "New Ticket created.",
        })
      );
      handleClose();
      dispatch(
        fetchLayerDataThunk({
          regionIdList: selectedRegionIds,
          layerKey,
        })
      );
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

  const handleAfterEdit = useCallback(() => {
    handleClose();
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      })
    );
  }, [selectedRegionIds]);

  const handleClose = useCallback(() => {
    dispatch(setMapState({}));
  }, []);

  return (
    <GisMapPopups>
      <Box width="550px" overflow="auto" maxHeight="85vh">
        <Stack>
          <Stack p={2} pb={1} direction="row" spacing={2} width="100%">
            <Typography
              color="primary.dark"
              flex={1}
              className="dtl-title"
              variant="h5"
            >
              {isEdit ? "Edit Ticket" : "Add Ticket"}
            </Typography>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider flexItem />
          <AddTicketForm
            formData={data}
            isEdit={isEdit}
            onSubmit={(newData) => {
              console.log(
                "🚀 ~ file: LayerComponents.js ~ line 249 ~ ElementForm ~ newData",
                newData
              );
              mutate({
                ...newData,
                // remove region coordinates
                regionCoords: undefined,
                coordinates: data.geometry,
              });
            }}
            isAdding={isTicketAdding}
            formCancelButton={
              <Button
                sx={{ minWidth: "10em" }}
                color="error"
                onClick={handleClose}
              >
                Cancel
              </Button>
            }
            handleAfterEdit={handleAfterEdit}
            formActionProps={{
              py: 1,
              spacing: 3,
              justifyContent: "flex-start",
            }}
            formSubmitButtonProps={{
              sx: { minWidth: "10em" },
              variant: "contained",
              disableElevation: true,
              color: "success",
            }}
            formSubmitButtonText="Submit"
          />
        </Stack>
      </Box>
    </GisMapPopups>
  );
};

export default TicketLayerForm;
