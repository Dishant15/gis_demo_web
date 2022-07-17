import React, { useRef } from "react";

import { Box, Button, TextField, Stack } from "@mui/material";

import {
  FormCheckbox,
  FormMUISelect,
  FormSelect,
} from "components/common/FormFields";
import { getRequiredFieldMessage } from "utils/constant";
import { useForm } from "react-hook-form";

const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

export default function TestForm() {
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
  return (
    <div
      style={{
        width: "50%",
      }}
    >
      <Box p={2} component="form">
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
            <FormSelect
              isMulti
              label="Region"
              required
              name="region"
              control={control}
              options={colourOptions}
              error={!!errors.region}
              helperText={errors.region?.message}
            />
          </Stack>
        </Stack>
      </Box>
    </div>
  );
}
