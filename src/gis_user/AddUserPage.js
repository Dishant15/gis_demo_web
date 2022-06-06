import React from "react";
import {
  Box,
  TextField,
  Stack,
  Typography,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import { useQuery } from "react-query";
import { fetchApplicationList } from "./data/services";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { noop, map } from "lodash";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const AddUserPage = () => {
  const { isLoading, data } = useQuery("applicationList", fetchApplicationList);
  console.log("🚀 ~ file: AddUserPage.js ~ line 9 ~ AddUserPage ~ data", data);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Container
      maxWidth="lg"
      mt={2}
      sx={{ backgroundColor: "background.default", minHeight: "100vh" }}
    >
      <Paper elevation={0}>
        <Stack divider={<Divider flexItem />}>
          <Stack p={1} direction="row" spacing={2} width="100%">
            <Typography flex={1} className="dtl-title" variant="h5">
              Add User
            </Typography>
          </Stack>
        </Stack>
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
      </Paper>
    </Container>
  );
};

export default AddUserPage;
