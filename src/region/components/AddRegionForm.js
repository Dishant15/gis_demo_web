import React from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { has, pick } from "lodash";

import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import { apiPostRegionAdd, apiPutRegionEdit } from "utils/url.constants";
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
        setTimeout(() => {
          queryClient.invalidateQueries("regionList");
        }, 10);
        onAreaCreate();
      },
    }
  );

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
    <Paper elevation={5}>
      <Box p={3}>
        <Typography mb={2} variant="h5">
          Region Details
        </Typography>
        <Box component="form" onSubmit={handleSubmit(mutate)}>
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
            {isLoading ? (
              <LoadingButton loading>Loading...</LoadingButton>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button type="submit" color="secondary" onClick={onAreaCreate}>
                  Cancel
                </Button>
                <Button type="submit" startIcon={<SaveIcon />}>
                  {!!data.id ? "Update" : "Add"}
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddRegionForm;
