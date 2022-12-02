import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  Box,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { get } from "lodash";
import { getRequiredFieldMessage } from "utils/constant";
import { postChangePassword } from "./services";
import { addNotification } from "redux/reducers/notification.reducer";
import { getHomePath } from "utils/url.constants";

const ChangePassword = () => {
  return (
    <Container>
      <Paper sx={{ mt: 3, maxWidth: "450px", margin: "32px auto auto auto" }}>
        <Stack>
          <Stack p={2} direction="row" spacing={2} width="100%">
            <Typography
              color="primary.dark"
              flex={1}
              className="dtl-title"
              variant="h5"
            >
              Change Password
            </Typography>
          </Stack>
          <Divider flexItem />
          <ChangePasswordForm />
        </Stack>
      </Paper>
    </Container>
  );
};

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: changePasswordMutate, isLoading } = useMutation(
    postChangePassword,
    {
      onSuccess: (res) => {
        dispatch(
          addNotification({
            type: "success",
            title: "Password changed successfully.",
          })
        );
        navigate(getHomePath());
      },
      onError: (err) => {
        const { current_password, new_password, confirm_password } = get(
          err,
          "response.data",
          {}
        );
        if (current_password) {
          setError("current_password", { message: current_password[0] });
        } else if (new_password) {
          setError("new_password", { message: new_password[0] });
        } else if (confirm_password) {
          setError("confirm_password", { message: confirm_password[0] });
        } else {
          dispatch(
            addNotification({
              type: "error",
              title: err.message,
            })
          );
        }
      },
    }
  );

  const onHandleSubmit = (resData) => {
    changePasswordMutate(resData);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  return (
    <Box p={2} component="form" onSubmit={handleSubmit(onHandleSubmit)}>
      <Stack spacing={2} direction="column">
        <TextField
          className="full-width"
          required
          error={!!errors.current_password}
          label="Current Password"
          type="password"
          {...register("current_password", {
            required: getRequiredFieldMessage("Current Password"),
          })}
          helperText={errors.current_password?.message}
        />
        <TextField
          className="full-width"
          required
          error={!!errors.new_password}
          label="New Password"
          type="password"
          {...register("new_password", {
            required: getRequiredFieldMessage("New Password"),
          })}
          helperText={errors.new_password?.message}
        />
        <TextField
          className="full-width"
          required
          error={!!errors.confirm_password}
          label="Confirm Password"
          type="password"
          {...register("confirm_password", {
            required: getRequiredFieldMessage("Confirm Password"),
            validate: (val) => {
              if (watch("new_password") != val) {
                return "New password and confirm password do not match, Please type again";
              }
            },
          })}
          helperText={errors.confirm_password?.message}
        />
        <LoadingButton variant="outlined" type="submit" loading={isLoading}>
          Submit
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default ChangePassword;
