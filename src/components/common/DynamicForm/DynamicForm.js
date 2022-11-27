import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import get from "lodash/get";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";

import {
  FormSelect,
  FormCheckbox,
  FormCreatableSelect,
  FormDateTimePicker,
} from "../FormFields";

import { getSingleLayerConfigurationList } from "planning/data/planningState.selectors";
import { fetchLayerListDetails } from "planning/data/actionBar.services";

export const FIELD_TYPES = {
  Input: "input",
  TextArea: "textArea",
  CheckBox: "checkBox",
  DateTime: "datetime",
  // single select
  Select: "select",
  SelectMulti: "selectMulti",
  SelectCreatable: "selectCreatable",
  // custom fields
  ConfigSelect: "configSelect",
};

/**
 * Render dynamicall generated formConfig based forms
 *
 * @formConfigs {sections: { title, fieldConfigs: [ { field_key, label, field_type } ] } }
 * @data initial data for edit forms
 */
const DynamicForm = forwardRef(
  (
    {
      formConfigs,
      data,
      onSubmit,
      onCancel,
      isLoading,
      configurationOptions = [],
    },
    ref
  ) => {
    const { sections } = formConfigs;

    const {
      formState: { errors },
      register,
      control,
      setError,
      clearErrors,
      handleSubmit,
    } = useForm({ defaultValues: data });

    useImperativeHandle(ref, () => ({
      onError: (fieldKey, errorMsg) => {
        setError(fieldKey, { type: "custom", message: errorMsg });
      },
    }));

    const onFormSubmit = useCallback((data) => {
      onSubmit(data, setError, clearErrors);
    }, []);

    return (
      <Box
        ref={ref}
        component="form"
        onSubmit={handleSubmit(onFormSubmit)}
        position="relative"
      >
        <IconButton
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          aria-label="close"
          onClick={onCancel}
        >
          <CloseIcon />
        </IconButton>
        <Stack p={2}>
          {sections.map((section, s_id) => {
            const { title, fieldConfigs, section_type } = section;

            return (
              <Stack key={s_id} spacing={2}>
                <Stack direction="row" width="100%">
                  <Typography color="primary.dark" flex={1} variant="h5">
                    {title}
                  </Typography>
                </Stack>

                <Divider />

                <Grid container pr={2} spacing={2} width="100%">
                  {fieldConfigs.map((config) => {
                    const {
                      field_key,
                      label,
                      field_type,
                      options = [],
                      validationProps,
                      disabled,
                    } = config;
                    const required = !!get(validationProps, "required");
                    switch (field_type) {
                      case FIELD_TYPES.Input:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <TextField
                              className="full-width"
                              label={label}
                              {...register(field_key, validationProps)}
                              disabled={!!disabled}
                              error={!!get(errors, [field_key])}
                              helperText={get(
                                errors,
                                [field_key, "message"],
                                ""
                              )}
                              InputLabelProps={{
                                required,
                              }}
                            />
                          </Grid>
                        );

                      case FIELD_TYPES.TextArea:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <TextField
                              className="full-width"
                              multiline
                              rows={3}
                              label={label}
                              {...register(field_key, validationProps)}
                              disabled={!!disabled}
                              error={!!get(errors, [field_key])}
                              helperText={get(
                                errors,
                                [field_key, "message"],
                                ""
                              )}
                              InputLabelProps={{
                                required,
                              }}
                            />
                          </Grid>
                        );

                      case FIELD_TYPES.CheckBox:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <FormCheckbox
                              label={label}
                              name={field_key}
                              control={control}
                              rules={validationProps}
                              disabled={!!disabled}
                              required={required}
                              error={!!get(errors, [field_key])}
                              helperText={get(
                                errors,
                                [field_key, "message"],
                                ""
                              )}
                            />
                          </Grid>
                        );
                      case FIELD_TYPES.ConfigSelect:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <FormSelect
                              label={label}
                              name={field_key}
                              control={control}
                              rules={validationProps}
                              isDisabled={!!disabled}
                              required={required}
                              options={configurationOptions}
                              error={!!get(errors, [field_key])}
                              helperText={get(
                                errors,
                                [field_key, "message"],
                                ""
                              )}
                              labelKey="config_name"
                              valueKey="id"
                            />
                          </Grid>
                        );
                      case FIELD_TYPES.Select:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <FormSelect
                              label={label}
                              name={field_key}
                              control={control}
                              rules={validationProps}
                              isDisabled={!!disabled}
                              required={required}
                              options={options || []}
                              error={!!get(errors, [field_key])}
                              helperText={get(
                                errors,
                                [field_key, "message"],
                                ""
                              )}
                            />
                          </Grid>
                        );

                      case FIELD_TYPES.SelectMulti:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <FormSelect
                              isMulti
                              label={label}
                              name={field_key}
                              control={control}
                              rules={validationProps}
                              isDisabled={!!disabled}
                              required={required}
                              options={config.options || []}
                              error={!!get(errors, [field_key])}
                              helperText={get(
                                errors,
                                [field_key, "message"],
                                ""
                              )}
                            />
                          </Grid>
                        );

                      case FIELD_TYPES.SelectCreatable:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <Stack width="100%">
                              <FormCreatableSelect
                                isMulti
                                label={label}
                                name={field_key}
                                labelKey={config.labelKey}
                                valueKey={config.valueKey}
                                control={control}
                                rules={validationProps}
                                isDisabled={!!disabled}
                                required={required}
                                options={config.options || []}
                                error={!!get(errors, [field_key])}
                                helperText={get(
                                  errors,
                                  [field_key, "message"],
                                  ""
                                )}
                              />
                            </Stack>
                          </Grid>
                        );

                      case FIELD_TYPES.DateTime:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <Stack width="100%">
                              <FormDateTimePicker
                                label={label}
                                name={field_key}
                                control={control}
                                rules={validationProps}
                                isDisabled={!!disabled}
                                error={!!get(errors, [field_key])}
                                helperText={get(
                                  errors,
                                  [field_key, "message"],
                                  ""
                                )}
                              />
                            </Stack>
                          </Grid>
                        );
                      default:
                        return (
                          <Grid item xs={12} sm={6} key={field_key}>
                            <div className="full-width">
                              <div>{label}</div>
                            </div>
                          </Grid>
                        );
                    }
                  })}
                </Grid>
              </Stack>
            );
          })}
        </Stack>
        <Stack p={3} spacing={3} direction="row">
          <Button sx={{ minWidth: "10em" }} color="error" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton
            sx={{ minWidth: "10em" }}
            variant="contained"
            disableElevation
            color="success"
            type="submit"
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    );
  }
);

export default DynamicForm;
