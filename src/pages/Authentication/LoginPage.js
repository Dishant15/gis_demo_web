import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Box, Button, TextField, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { postLogin } from "./services";
import { parseErrorMessage } from "../../utils/api.utils";
import { login } from "../../redux/reducers/auth.reducer";
import { getIsUserLoggedIn } from "../../redux/selectors/auth.selectors";
import { getHomePath } from "../../utils/url.constants";

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
      <div className="shadow" />
      <div className="login-page">
        <div className="login-page-content">
          <div className="heading hide-on-small-and-down">
            <div className="text">
              An innovation towards NETWORK. <br /> Network GIS.
            </div>
          </div>
          <div className="form-block">
            <LoginForm />
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
      dispatch(login(res.token));
    },
    onError: (err) => {
      const errorMessage = parseErrorMessage(err);
      setError("password", { message: errorMessage });
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(mutate)}
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
        {isLoading ? (
          <LoadingButton loading>Loading...</LoadingButton>
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
