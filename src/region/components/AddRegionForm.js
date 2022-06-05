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

import {
  apiPostAreaPocketAdd,
  apiPutAreaPocketEdit,
} from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import Api from "utils/api.utils";

const DEFAULT_DATA = {
  name: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  coordinates: [],
};

const AddRegionForm = ({ data = {}, onAreaCreate }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      let submitData = pick(data, [
        "parentId",
        "name",
        "area",
        "city",
        "state",
        "pincode",
        "coordinates",
      ]);
      if (has(data, "id")) {
        Api.put(apiPutAreaPocketEdit(data.id), submitData);
      } else {
        Api.post(apiPostAreaPocketAdd(), submitData);
      }
    },
    {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
            title: "New Area created",
          })
        );
        // refetch list after add success
        setTimeout(() => {
          queryClient.invalidateQueries("areaPocketList");
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
          Area Pocket Details
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
              label="Area"
              {...register("area", { required: true })}
            />
            <TextField
              error={!!errors.city}
              label="City"
              {...register("city", { required: true })}
            />
            <TextField
              error={!!errors.state}
              label="State"
              {...register("state", { required: true })}
            />
            <TextField
              error={!!errors.pincode}
              label="Pincode"
              {...register("pincode", { required: true })}
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
