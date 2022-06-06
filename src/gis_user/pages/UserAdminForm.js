import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { noop, map } from "lodash";

import {
  Box,
  TextField,
  Stack,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import UserFormSteps from "gis_user/components/UserFormSteps";

import { fetchApplicationList } from "../data/services";

/**
 * Render user Add / Edit form
 * display empty / filled user form data
 * Handle submit
 *
 * Renders
 *  UserFormSteps
 *
 */
const UserAdminForm = () => {
  const { isLoading, data } = useQuery("applicationList", fetchApplicationList);
  console.log(
    "🚀 ~ file: UserAdminForm.js ~ line 9 ~ UserAdminForm ~ data",
    data
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Stack>
      <Stack p={2} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          Add User
        </Typography>
      </Stack>

      <Divider flexItem />

      <Box my={2} px={2}>
        <UserFormSteps
          activeStep={1}
          stepList={[
            {
              isStepOptional: false,
              text: "Add / Update user details",
              completed: true,
            },
            {
              isStepOptional: true,
              text: "Select user permissions",
              completed: false,
            },
            {
              isStepOptional: false,
              text: "Assign regions current user can access",
              completed: false,
            },
          ]}
        />
      </Box>

      <Box p={2} component="form" onSubmit={handleSubmit(noop)}>
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
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Admin"
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default UserAdminForm;
