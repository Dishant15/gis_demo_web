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
import DoneIcon from "@mui/icons-material/Done";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Close } from "@mui/icons-material";

import {
  apiPostRegionAdd,
  apiPutRegionEdit,
  apiRegionDelete,
} from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import Api from "utils/api.utils";

const DEFAULT_DATA = {
  name: "",
  unique_id: "",
  parentId: "",
  coordinates: [],
};

const AddRegionForm = ({ data = {}, onAreaCreate }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (formData) => {
      let submitData = pick(formData, [
        "parentId",
        "name",
        "unique_id",
        "coordinates",
      ]);
      if (has(formData, "id")) {
        Api.put(apiPutRegionEdit(data.id), submitData);
      } else {
        Api.post(apiPostRegionAdd(), submitData);
      }
    },
    {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
            title: "New Region created",
          })
        );
        // refetch list after add success
        queryClient.invalidateQueries("regionList");
        onAreaCreate();
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
        <Box p={2} component="form" onSubmit={handleSubmit(mutate)}>
          <Stack spacing={2}>
            <TextField
              error={!!errors.name}
              label="Name"
              {...register("name", { required: true })}
              helperText={errors.name?.message}
            />
            <TextField
              error={!!errors.area}
              label="Unique ID"
              {...register("unique_id", { required: true })}
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
                  {!!data.id ? "Update" : "Add"}
                </Button>
              )}

              {!!data.id ? (
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
