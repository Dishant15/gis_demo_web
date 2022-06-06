import React, { useCallback } from "react";
import Select from "react-select";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { map } from "lodash";

import {
  Box,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { Done } from "@mui/icons-material";

import { fetchApplicationList } from "../data/services";

/**
 * Render user Add / Edit form
 * display empty / filled user form data
 * Handle submit
 *
 * Parent
 *  UserAdminForm
 */
const UserForm = ({ onSubmit }) => {
  const { isLoading, data } = useQuery("applicationList", fetchApplicationList);
  console.log(
    "🚀 ~ file: UserAdminForm.js ~ line 9 ~ UserAdminForm ~ data",
    data
  );

  const onFormSubmit = useCallback(
    (formData) => {
      console.log(
        "🚀 ~ file: UserForm.js ~ line 33 ~ onFormSubmit ~ formData",
        formData
      );
      onSubmit();
    },
    [onSubmit]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Box p={2} component="form" onSubmit={handleSubmit(onFormSubmit)}>
      <Stack spacing={2}>
        <TextField
          error={!!errors.name}
          label="User Name"
          {...register("username", { required: true })}
          helperText={errors.username?.message}
        />
        <TextField
          error={!!errors.name}
          label="Full Name"
          {...register("name", { required: true })}
          helperText={errors.name?.message}
        />
        <TextField
          error={!!errors.name}
          label="Email"
          {...register("email", { required: true })}
          helperText={errors.email?.message}
        />
        <TextField
          error={!!errors.name}
          label="Password"
          type="password"
          {...register("password", { required: true })}
          helperText={errors.password?.message}
        />
        <TextField
          error={!!errors.name}
          label="Confirm Password"
          type="password"
          {...register("confirm_password", { required: true })}
          helperText={errors.confirm_password?.message}
        />
        <Select
          isMulti
          name="access_ids"
          options={map(data, (d) => ({ value: d.id, label: d.name }))}
        />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Admin" />

        <Button type="submit" startIcon={<Done />}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm;
