import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Box, Button, TextField, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormHelperTextControl } from "components/common/FormFields";
import Notification from "components/common/Notification";

import { get } from "lodash";

import { postLogin } from "pages/Authentication/services";
import { parseErrorMessagesWithFields } from "utils/api.utils";
import { login } from "redux/reducers/auth.reducer";
import { getIsUserLoggedIn } from "redux/selectors/auth.selectors";
import { getHomePath, getPrivacyPolicy } from "utils/url.constants";

import "./login-page.scss";
/**
 * Parent:
 *    App
 */
const LoginPage = (props) => {
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector(getIsUserLoggedIn);

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate(getHomePath());
    }
  }, [isUserLoggedIn]);

  return (
    <div className="auth-page">
      <Notification />
      <div className="shadow" />
      <div className="login-page">
        <div className="login-page-content">
          <div className="heading hide-on-small-and-down">
            <div className="text">
              Your network under your control <br /> Network GIS
            </div>
          </div>
          <div className="form-block">
            <LoginForm />
            <div class="privacy-policy-link">
              <a href={getPrivacyPolicy()}>Read Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();
  const dispatch = useDispatch();

  const { mutate, isLoading } = useMutation(postLogin, {
    onSuccess: (res) => {
      // {token, user, permissions}
      dispatch(login(res));
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

  const onSubmit = useCallback((data) => {
    mutate({ ...data, client_id: process.env.REACT_APP_CLIENT_ID });
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      id="login-form"
      className="form-inner-block"
    >
      <div className="company-title">NETWORK GIS</div>
      <Stack spacing={4}>
        <TextField
          error={!!errors.username}
          label="Username"
          {...register("username", { required: "Username is required." })}
          helperText={errors.username?.message}
        />
        <TextField
          error={!!errors.password}
          label="Password"
          type="password"
          {...register("password", { required: "Password is required." })}
          helperText={errors.password?.message}
        />
        {!!errors.__all__ ? (
          <FormHelperTextControl error={!!errors.__all__} className="mt-8">
            {get(errors, "__all__.message", "")}
          </FormHelperTextControl>
        ) : null}
        {isLoading ? (
          <LoadingButton variant="contained" loading>
            Loading...
          </LoadingButton>
        ) : (
          <Button type="submit" variant="contained">
            Login
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default LoginPage;
