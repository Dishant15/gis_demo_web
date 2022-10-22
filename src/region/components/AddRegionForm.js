import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { has, pick } from "lodash";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Close, HighlightAltOutlined } from "@mui/icons-material";

import {
  apiPostRegionAdd,
  apiPutRegionEdit,
  apiRegionDelete,
} from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import { latLongMapToCoords } from "utils/map.utils";
import Api from "utils/api.utils";
import { getRequiredFieldMessage } from "utils/constant";
import { parseErrorMessagesWithFields } from "utils/api.utils";

const DEFAULT_DATA = {
  name: "",
  unique_id: "",
  parentId: "",
  coordinates: [],
};

const AddRegionForm = ({
  data = {},
  onAreaCreate,
  startEditRegion = null,
  handleRegionCreate = null,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isEdit = !!data?.id;

  const { mutate, isLoading } = useMutation(
    (formData) => {
      let submitData = pick(formData, ["name", "unique_id"]);
      // dont send center of polygon. let backend calculate center
      if (has(formData, "id")) {
        submitData.parentId = formData.parent;
        // convert coordinate to list of [lat, lng]
        submitData.coordinates = latLongMapToCoords(formData.coordinates[0]);
        Api.put(apiPutRegionEdit(data.id), submitData);
      } else {
        submitData.parentId = formData.parentId;
        // convert coordinate to list of [lat, lng]
        submitData.coordinates = latLongMapToCoords(formData.coordinates);
        Api.post(apiPostRegionAdd(), submitData);
      }
    },
    {
      onSuccess: (data, variables) => {
        let title = "";
        if (has(variables, "id")) {
          title = "Region updated successfully";
        } else {
          title = "New Region created";
        }
        dispatch(
          addNotification({
            type: "success",
            title: title,
          })
        );
        // refetch list after add success
        queryClient.invalidateQueries("regionList");
        onAreaCreate();
      },
      onError: (err) => {
        const { fieldList, messageList } = parseErrorMessagesWithFields(err);
        for (let index = 0; index < fieldList.length; index++) {
          const field = fieldList[index];
          const errorMessage = messageList[index];
          dispatch(
            addNotification({
              type: "error",
              title: field,
              text: errorMessage,
            })
          );
        }
      },
    }
  );

  const { mutate: deleteRegion, isLoading: deleteLoading } = useMutation(
    (regionId) => {
      Api.delete(apiRegionDelete(regionId));
    },
    {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "warning",
            title: "Region deleted successfully",
          })
        );
        // refetch list after add success
        queryClient.invalidateQueries("regionList");
        onAreaCreate();
      },
    }
  );

  const handleDelete = useCallback(() => {
    if (deleteLoading) return;
    deleteRegion(data.id);
  }, [data, deleteLoading]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...DEFAULT_DATA,
      ...data,
    },
  });

  return (
    <Paper elevation={5} sx={{ minWidth: "400px" }}>
      <Box>
        <Stack p={2} direction="row">
          <Typography color="primary.dark" flex={1} variant="h5">
            Region Details
          </Typography>
          <Button
            sx={{ minWidth: "150px" }}
            size="small"
            color="secondary"
            endIcon={<Close />}
            onClick={onAreaCreate}
          >
            Close
          </Button>
        </Stack>
        <Divider flexItem orientation="horizontal" />
        {!!startEditRegion ? ( // show edit polygon & add child btn if we have the handlers
          <>
            <Stack p={1} px={2} direction="row">
              <Button
                startIcon={<HighlightAltOutlined />}
                onClick={startEditRegion(data)}
              >
                Edit On Map
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={handleRegionCreate(data.id, data.coordinates)}
              >
                Add Region
              </Button>
            </Stack>
            <Divider flexItem orientation="horizontal" />
          </>
        ) : null}
        <Box p={2} component="form" onSubmit={handleSubmit(mutate)}>
          <Stack spacing={2}>
            <TextField
              error={!!errors.name}
              label="Name *"
              {...register("name", {
                required: getRequiredFieldMessage("Name"),
              })}
              helperText={errors.name?.message}
            />
            <TextField
              error={!!errors.unique_id}
              label="Unique ID *"
              {...register("unique_id", {
                required: getRequiredFieldMessage("Unique ID"),
                disabled: isEdit,
              })}
              helperText={errors.unique_id?.message}
              disabled={isEdit}
            />

            <Stack direction="row">
              {isLoading ? (
                <LoadingButton sx={{ minWidth: "150px" }} loading>
                  Loading...
                </LoadingButton>
              ) : (
                <Button
                  sx={{ minWidth: "150px" }}
                  type="submit"
                  startIcon={<DoneIcon />}
                >
                  {isEdit ? "Update" : "Add"}
                </Button>
              )}

              {isEdit ? (
                deleteLoading ? (
                  <LoadingButton sx={{ minWidth: "150px" }} loading>
                    Loading...
                  </LoadingButton>
                ) : (
                  <Button
                    sx={{ minWidth: "150px" }}
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )
              ) : null}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddRegionForm;
