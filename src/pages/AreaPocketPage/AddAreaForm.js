import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import { apiPostAreaPocketAdd } from "../../utils/url.constants";
import Api from "../../utils/api.utils";
import { pick } from "lodash";

const DEFAULT_DATA = {
  name: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  coordinates: [],
};

const AddAreaForm = ({ data = {}, onAreaCreate }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) =>
      Api.post(apiPostAreaPocketAdd(), {
        unique_id: "p",
        ...pick(data, [
          "name",
          "area",
          "city",
          "state",
          "pincode",
          "coordinates",
        ]),
      }),
    {
      onSuccess: ({ data }) => {
        // refetch list after add success
        queryClient.invalidateQueries("areaPocketList");
        onAreaCreate(data.id);
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
            <Button type="submit">{!!data.id ? "Update" : "Add"}</Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddAreaForm;
