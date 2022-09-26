import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import get from "lodash/get";

import { Box, TextField, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";

import { FormCheckbox, FormSelect } from "components/common/FormFields";

import { editUserDetails, fetchApplicationList } from "../data/services";
import { parseBadRequest } from "utils/api.utils";
import { getUserListPage } from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import { getRequiredFieldMessage } from "utils/constant";

/**
 * Render user Edit form
 *
 * Parent
 *  UserAdminForm
 */
const UserEditForm = ({ onSubmit, formData }) => {
  const dispatch = useDispatch();

  const { isLoading: applicationsLoading, data } = useQuery(
    "applicationList",
    fetchApplicationList
  );

  const { mutate, isLoading: isUserEditing } = useMutation(editUserDetails, {
    onSuccess: (res) => {
      onSubmit(res);
      dispatch(
        addNotification({
          type: "success",
          title: "User update",
          text: "User updated successfully",
        })
      );
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

  const onHandleSubmit = (resData) => {
    mutate({
      userId: formData.id,
      data: resData,
    });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      username: get(formData, "username", ""),
      name: get(formData, "name", ""),
      email: get(formData, "email", ""),
      is_staff: !!get(formData, "is_staff"),
      is_active: !!get(formData, "is_active"),
      access_ids: get(formData, "access_ids", ""),
    },
  });

  const password = useRef({});
  password.current = watch("password", "");

  return (
    <Box p={2} component="form" onSubmit={handleSubmit(onHandleSubmit)}>
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
            disabled
            label="User Name"
            {...register("username", { required: false, disabled: true })}
            helperText={errors.username?.message}
          />
          <TextField
            required
            error={!!errors.name}
            label="Full Name"
            {...register("name", {
              required: getRequiredFieldMessage("Full Name"),
            })}
            helperText={errors.name?.message}
          />
          <TextField
            required
            error={!!errors.email}
            label="Email"
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
          <FormSelect
            label="Access Type"
            isMulti
            name="access_ids"
            control={control}
            options={data || []}
            labelKey="name"
            valueKey="id"
            error={!!errors.access_ids}
            helperText={errors.access_ids?.message}
            isLoading={applicationsLoading}
            rules={{
              required: getRequiredFieldMessage("Access Type"),
            }}
          />
          <FormCheckbox
            label="Admin"
            name="is_staff"
            control={control}
            error={!!errors.is_staff}
            helperText={errors.is_staff?.message}
          />
          <FormCheckbox
            label="Active"
            name="is_active"
            control={control}
            error={!!errors.is_staff}
            helperText={errors.is_staff?.message}
          />
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
          loading={isUserEditing}
        >
          Next
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default UserEditForm;
