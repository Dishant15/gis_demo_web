import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Stack,
  Typography,
  TextField,
  Box,
  InputLabel,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { FormSelect } from "components/common/FormFields";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

import { SURVEY_TAG_LIST } from "utils/constant";
import { filter, includes } from "lodash";

const CATEGORY_OPTS = [
  { value: "M", label: "MDU" },
  { value: "S", label: "SDU" },
];

/**
 * Parent:
 *    WorkOrderPage
 */
const UnitEditForm = (props) => {
  const { formData, editUnitLoading, onEditComplete, handleUnitDetailsCancel } =
    props;

  const surveyTagList = useMemo(() => {
    return filter(SURVEY_TAG_LIST, function (o) {
      return includes(formData.selectedSurveyTags, o.value);
    });
  }, [formData.selectedSurveyTags]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: formData.name,
      category: formData.category,
      tags: formData.tags,
      tags: filter(surveyTagList, (d) =>
        includes(formData.tags.split(","), d.value)
      ),
      floors: String(formData.floors),
      house_per_floor: String(formData.house_per_floor),
      total_home_pass: String(formData.total_home_pass),
    },
  });

  const onSubmit = (data) => {
    onEditComplete(
      { ...data, id: formData.id, parentId: formData.parentId },
      isDirty
    );
  };

  const selectedCategory = watch("category");

  return (
    <Stack>
      <Stack p={2} pb={1} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          Edit Unit
        </Typography>
        <IconButton aria-label="close" onClick={handleUnitDetailsCancel}>
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
            <Controller
              render={({ field }) => {
                return (
                  <Stack>
                    <InputLabel>Category</InputLabel>
                    <Stack direction="row" spacing={1}>
                      {CATEGORY_OPTS.map((opt) => {
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
              name="category"
              control={control}
              rules={{
                required: "Category is required.",
              }}
            />
          </Stack>
        </Stack>
        {selectedCategory === "M" ? (
          <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
            <Stack
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              <TextField
                required
                error={!!errors.floors}
                label="Floors"
                {...register("floors", {
                  required: "This fields is required.",
                })}
                type="number"
                helperText={errors.floors?.message}
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
                error={!!errors.house_per_floor}
                label="House per floor"
                {...register("house_per_floor", {
                  required: "This fields is required.",
                })}
                type="number"
                helperText={errors.house_per_floor?.message}
              />
            </Stack>
          </Stack>
        ) : null}
        <Stack spacing={2} my={3} direction={{ md: "row", xs: "column" }}>
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              required
              error={!!errors.total_home_pass}
              label={
                selectedCategory === "M" ? "Total home pass" : "No. of units"
              }
              {...register("total_home_pass", {
                required: "This fields is required.",
              })}
              type="number"
              helperText={errors.total_home_pass?.message}
            />
          </Stack>
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
              options={surveyTagList}
              error={!!errors.tags}
              helperText={errors.tags?.message}
              rules={{
                required: "This fields is required.",
              }}
            />
          </Stack>
        </Stack>
        <Stack flex={1} pt={2} direction="row" justifyContent="flex-end">
          <LoadingButton
            variant="outlined"
            color="success"
            type="submit"
            endIcon={<DoneIcon />}
            loading={editUnitLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default UnitEditForm;
