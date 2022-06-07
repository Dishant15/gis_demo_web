import React, { useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { map } from "lodash";

import { Box, TextField, Stack, Button } from "@mui/material";
import { Done } from "@mui/icons-material";

import { addNewUser, fetchApplicationList } from "../data/services";
import { FormSelect, FormCheckbox } from "components/common/FormFields";
import { parseBadRequest } from "utils/api.utils";

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
  const { mutate, isLoading: isUserAdding } = useMutation(addNewUser, {
    onSuccess: (res) => {
      onSubmit();
    },
    onError: (err) => {
      const parsedError = parseBadRequest(err);
      if (parsedError) {
        for (const key in parsedError) {
          if (Object.hasOwnProperty.call(parsedError, key)) {
            setError(key, { message: parsedError[key][0] });
          }
        }
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setError,
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  return (
    <Box p={2} component="form" onSubmit={handleSubmit(mutate)}>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            required
            error={!!errors.username}
            label="User Name"
            {...register("username", { required: true })}
            helperText={errors.username?.message}
          />
          <TextField
            required
            error={!!errors.name}
            label="Full Name"
            {...register("name", { required: true })}
            helperText={errors.name?.message}
          />
          <TextField
            required
            error={!!errors.email}
            label="Email"
            {...register("email", { required: true })}
            helperText={errors.email?.message}
          />
        </Stack>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            required
            error={!!errors.password}
            label="Password"
            type="password"
            {...register("password", { required: true })}
            helperText={errors.password?.message}
          />
          <TextField
            required
            error={!!errors.confirm_password}
            label="Confirm Password"
            type="password"
            {...register("confirm_password", {
              required: true,
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
            helperText={errors.confirm_password?.message}
          />
          <FormSelect
            label="Access Type"
            required
            isMulti
            name="access_ids"
            control={control}
            options={map(data, (d) => ({ value: d.id, label: d.name }))}
            error={!!errors.access_ids}
            helperText={errors.access_ids?.message}
          />
          <FormCheckbox
            label="Admin"
            name="is_staff"
            control={control}
            error={!!errors.is_staff}
            helperText={errors.is_staff?.message}
          />
        </Stack>
      </Stack>
      <Stack p={4} sx={{ alignItems: "flex-end" }}>
        <Button type="submit" startIcon={<Done />} isLoading={isUserAdding}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm;
