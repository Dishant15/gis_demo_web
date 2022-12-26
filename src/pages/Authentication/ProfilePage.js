import React from "react";

import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";

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

import { getLoggedUserDetails } from "redux/selectors/auth.selectors";
import { getRequiredFieldMessage } from "utils/constant";
import { postProfileEdit } from "./services";
import { updateUserDetails } from "redux/reducers/auth.reducer";
import { addNotification } from "redux/reducers/notification.reducer";

const ProfilePage = () => {
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
              Profile
            </Typography>
          </Stack>
          <Divider flexItem />
          <ProfileForm />
        </Stack>
      </Paper>
    </Container>
  );
};

const ProfileForm = () => {
  const dispatch = useDispatch();
  const loggedUserDetails = useSelector(getLoggedUserDetails);

  const { mutate, isLoading } = useMutation(postProfileEdit, {
    onSuccess: (res) => {
      dispatch(updateUserDetails(res));
      dispatch(
        addNotification({
          type: "success",
          title: "Profile updated successfully.",
        })
      );
    },
    onError: (err) => {
      dispatch(
        addNotification({
          type: "error",
          title: "failed to update profile.",
        })
      );
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: get(loggedUserDetails, "name", ""),
    },
  });

  return (
    <Box p={2} component="form" onSubmit={handleSubmit(mutate)}>
      <Stack spacing={2} direction="column">
        <TextField
          className="full-width"
          required
          error={!!errors.name}
          label="Name"
          helperText={errors.name?.message}
          {...register("name", {
            required: getRequiredFieldMessage("Name"),
          })}
        />
        <TextField
          className="full-width"
          label="Role"
          value={get(loggedUserDetails, "role_name", "")}
          disabled
        />
        <TextField
          className="full-width"
          label="Username"
          value={get(loggedUserDetails, "username", "")}
          disabled
        />
        <TextField
          className="full-width"
          label="Email"
          value={get(loggedUserDetails, "email", "")}
          disabled
        />
        <TextField
          className="full-width"
          label="Mobile Number"
          value={get(loggedUserDetails, "mobile_number") || "-NA-"}
          disabled
        />
        <LoadingButton variant="outlined" type="submit" loading={isLoading}>
          Submit
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default ProfilePage;
