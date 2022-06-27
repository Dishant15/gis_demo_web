import React from "react";
import { useForm, Controller } from "react-hook-form";
import { filter, includes, map } from "lodash";

import {
  Stack,
  Typography,
  TextField,
  Box,
  Divider,
  IconButton,
  InputLabel,
  Chip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

import {
  FormSelect,
  FormCreatableSelect,
  FormCheckbox,
} from "components/common/FormFields";

import {
  BroadbandProviders,
  SURVEY_TAG_LIST,
  TVProviders,
  LOCALITY_OPTS,
} from "utils/constant";

/**
 * Parent:
 *    WorkOrderPage
 */
const SurveyEditForm = (props) => {
  const {
    formData,
    editSurveyLoading,
    onEditComplete,
    handleSurveyDetailsCancel,
  } = props;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    register,
  } = useForm({
    defaultValues: {
      id: formData.id,
      name: formData.name,
      address: formData.address,
      area: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      over_head_cable: formData.over_head_cable,
      cabling_required: formData.cabling_required,
      poll_cabling_possible: formData.poll_cabling_possible,
      locality_status: formData.locality_status,
      tags: filter(SURVEY_TAG_LIST, (d) =>
        includes(formData.tags.split(","), d.value)
      ),
      broadband_availability: map(
        formData.broadband_availability.split(","),
        (d) => ({
          label: d,
          value: d,
        })
      ),
      cable_tv_availability: map(
        formData.cable_tv_availability.split(","),
        (d) => ({
          label: d,
          value: d,
        })
      ),
    },
  });

  const onSubmit = (data) => {
    onEditComplete(data, isDirty);
  };

  return (
    <Stack>
      <Stack p={2} pb={1} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          Edit Survey
        </Typography>
        <IconButton aria-label="close" onClick={handleSurveyDetailsCancel}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider flexItem />
      <Box
        p={2}
        pt={0}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          overflow: "auto",
        }}
      >
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              error={!!errors.name}
              label="Name"
              {...register("name", { required: "This fields is required." })}
              helperText={errors.name?.message}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              multiline
              rows={3}
              error={!!errors.address}
              label="Address"
              {...register("address", { required: "This fields is required." })}
              helperText={errors.address?.message}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              error={!!errors.area}
              label="Area"
              {...register("area", { required: "This fields is required." })}
              helperText={errors.area?.message}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              error={!!errors.city}
              label="City"
              {...register("city", { required: "This fields is required." })}
              helperText={errors.city?.message}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              error={!!errors.state}
              label="State"
              {...register("state", { required: "This fields is required." })}
              helperText={errors.state?.message}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              error={!!errors.pincode}
              label="Pincode"
              {...register("pincode", { required: "This fields is required." })}
              helperText={errors.pincode?.message}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <FormSelect
              label="Tags"
              required
              name="tags"
              isMulti
              control={control}
              options={SURVEY_TAG_LIST}
              error={!!errors.tags}
              helperText={errors.tags?.message}
              rules={{
                required: "This fields is required.",
              }}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <FormCreatableSelect
              label="Broadband Service Availability"
              required
              name="broadband_availability"
              isMulti
              control={control}
              options={BroadbandProviders}
              error={!!errors.broadband_availability}
              helperText={errors.broadband_availability?.message}
              rules={{
                required: "This fields is required.",
              }}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <FormCreatableSelect
              label="Cable TV Service Availability"
              required
              name="cable_tv_availability"
              isMulti
              control={control}
              options={TVProviders}
              error={!!errors.cable_tv_availability}
              helperText={errors.cable_tv_availability?.message}
              rules={{
                required: "This fields is required.",
              }}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <Controller
              render={({ field }) => {
                return (
                  <Stack>
                    <InputLabel>Locality</InputLabel>
                    <Stack direction="row" spacing={1}>
                      {LOCALITY_OPTS.map((opt) => {
                        const selected = opt.value === field.value;
                        return (
                          <Chip
                            color={selected ? "primary" : undefined}
                            key={opt.value}
                            label={opt.label}
                            onClick={() => field.onChange(opt.value)}
                          />
                        );
                      })}
                    </Stack>
                  </Stack>
                );
              }}
              name="locality_status"
              control={control}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <FormCheckbox
              label="Over head cable allowed"
              name="over_head_cable"
              control={control}
              error={!!errors.over_head_cable}
              helperText={errors.over_head_cable?.message}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <FormCheckbox
              label="In Building cabeling required"
              name="cabling_required"
              control={control}
              error={!!errors.cabling_required}
              helperText={errors.cabling_required?.message}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <FormCheckbox
              label="Pole to pole cabling possible"
              name="poll_cabling_possible"
              control={control}
              error={!!errors.poll_cabling_possible}
              helperText={errors.poll_cabling_possible?.message}
            />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          />
        </Stack>
        <Stack flex={1} pt={2} direction="row" justifyContent="flex-end">
          <LoadingButton
            variant="outlined"
            color="success"
            type="submit"
            endIcon={<DoneIcon />}
            loading={editSurveyLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default SurveyEditForm;
