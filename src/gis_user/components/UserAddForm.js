import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import get from "lodash/get";

import { Box, Button, TextField, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";

import { addNewUser, fetchApplicationList } from "../data/services";
import {
  FormCheckbox,
  FormSelect,
  FormHelperTextControl,
} from "components/common/FormFields";
import { parseErrorMessagesWithFields } from "utils/api.utils";
import { getUserListPage } from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import { getRequiredFieldMessage } from "utils/constant";

/**
 * Render user Add form
 * display empty / filled user form data
 * Handle submit
 *
 * Parent
 *  UserAdminForm
 */
const UserAddForm = ({ onSubmit }) => {
  const { isLoading, data } = useQuery("applicationList", fetchApplicationList);
  const dispatch = useDispatch();

  const { mutate, isLoading: isUserAdding } = useMutation(addNewUser, {
    onSuccess: (res) => {
      onSubmit(res);
      dispatch(
        addNotification({
          type: "success",
          title: "New user created",
        })
      );
    },
    onError: (err) => {
      const { fieldList, messageList } = parseErrorMessagesWithFields(err);
      for (let index = 0; index < fieldList.length; index++) {
        const field = fieldList[index];
        const errorMessage = messageList[index];
        setError(field, { message: errorMessage });
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
  } = useForm({
    defaultValues: {
      is_active: true,
      is_staff: false,
      access_ids: [],
    },
  });

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
            error={!!errors.username}
            label="User Name *"
            {...register("username", {
              required: getRequiredFieldMessage("User Name"),
            })}
            helperText={errors.username?.message}
          />
          <TextField
            error={!!errors.name}
            label="Full Name *"
            {...register("name", {
              required: getRequiredFieldMessage("Full Name"),
            })}
            helperText={errors.name?.message}
          />
          <TextField
            error={!!errors.email}
            label="Email *"
            {...register("email", {
              required: getRequiredFieldMessage("Email"),
            })}
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
            error={!!errors.password}
            label="Password *"
            type="password"
            {...register("password", {
              required: getRequiredFieldMessage("Password"),
            })}
            helperText={errors.password?.message}
          />
          <TextField
            error={!!errors.confirm_password}
            label="Confirm Password *"
            type="password"
            {...register("confirm_password", {
              required: getRequiredFieldMessage("Confirm Password"),
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
            helperText={errors.confirm_password?.message}
          />
          <FormSelect
            label="Access Type *"
            isMulti
            name="access_ids"
            control={control}
            options={data || []}
            labelKey="name"
            valueKey="id"
            error={!!errors.access_ids}
            helperText={errors.access_ids?.message}
            rules={{
              required: getRequiredFieldMessage("Access Type"),
            }}
          />
          <FormCheckbox
            label="Active"
            name="is_active"
            control={control}
            error={!!errors.is_active}
            helperText={errors.is_active?.message}
          />
          <FormCheckbox
            label="Admin"
            name="is_staff"
            control={control}
            error={!!errors.is_staff}
            helperText={errors.is_staff?.message}
          />
          {!!errors.__all__ ? (
            <FormHelperTextControl error={!!errors.__all__} className="mt-8">
              {get(errors, "__all__.message", "")}
            </FormHelperTextControl>
          ) : null}
        </Stack>
      </Stack>
      <Stack flex={1} direction="row" p={4} justifyContent="space-between">
        <Button
          variant="outlined"
          component={Link}
          to={getUserListPage()}
          startIcon={<CloseIcon />}
          color="error"
        >
          Cancel
        </Button>
        <LoadingButton
          variant="outlined"
          type="submit"
          endIcon={<ArrowForwardIosIcon />}
          loading={isUserAdding}
        >
          Next
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default UserAddForm;
