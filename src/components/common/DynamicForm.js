import React from "react";
import { useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { FormSelect } from "./FormFields";

/**
 * Render dynamicall generated formConfig based forms
 *
 * @formConfigs {sections: { title, fieldConfigs: [ { field_key, label, field_type } ] } }
 * @data initial data for edit forms
 */
const DynamicForm = ({ formConfigs, data, onSubmit, onClose, isLoading }) => {
  const { sections } = formConfigs;

  const { register, control, handleSubmit } = useForm({
    defaultValues: data,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {sections.map((section, s_id) => {
        const { title, fieldConfigs, showCloseIcon } = section;
        return (
          <Stack key={s_id} spacing={2} p={2} divider={<Divider />}>
            <Stack direction="row" spacing={2} width="100%">
              <Typography color="primary.dark" flex={1} variant="h5">
                {title}
              </Typography>
              {showCloseIcon ? (
                <IconButton aria-label="close" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              ) : null}
            </Stack>
            <Box>
              {fieldConfigs.map((config) => {
                const { field_key, label, field_type } = config;

                switch (field_type) {
                  case "input":
                    return (
                      <TextField
                        key={field_key}
                        label={label}
                        {...register(field_key)}
                      />
                    );

                  case "textArea":
                    return (
                      <TextField
                        key={field_key}
                        multiline
                        rows={3}
                        label={label}
                        {...register(field_key)}
                      />
                    );

                  case "select":
                    return (
                      <FormSelect
                        key={field_key}
                        label={label}
                        name={field_key}
                        control={control}
                        options={config.options || []}
                      />
                    );

                  default:
                    return (
                      <div key={field_key}>
                        <div>{label}</div>
                      </div>
                    );
                }
              })}
            </Box>
          </Stack>
        );
      })}
      <Stack p={2}>
        <LoadingButton
          variant="outlined"
          color="success"
          type="submit"
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default DynamicForm;
