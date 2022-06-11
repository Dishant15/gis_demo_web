import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { Box, Typography, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Done } from "@mui/icons-material";

import { FormSelect } from "components/common/FormFields";
import { fetchRegionList } from "region/data/services";
import { filter } from "lodash";

const UserRegionSelect = ({ goBack }) => {
  const { isLoading: regionListLoading, data: regionList } = useQuery(
    "regionList",
    fetchRegionList,
    {
      initialData: [],
      onSuccess: (res) => {
        const region = filter(res, ["id", 1]);
        if (region) {
          setValue("region", region);
        }
      },
    }
  );

  const onSubmit = (data) => {
    console.log(
      "🚀 ~ file: UserRegionSelect.js ~ line 29 ~ onSubmit ~ data",
      data
    );
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
  } = useForm();

  return (
    <Box>
      <Typography variant="h4">User Region Assignment form</Typography>
      <Box p={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          isMulti
          label="Region"
          required
          name="region"
          control={control}
          options={regionList}
          getOptionLabel={(opt) => opt.name}
          getOptionValue={(opt) => opt.id}
          error={!!errors.region}
          helperText={errors.region?.message}
          isLoading={regionListLoading}
        />
        <Stack flex={1} p={4} direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            color="error"
            startIcon={<ArrowBackIosIcon />}
            onClick={goBack}
          >
            Back
          </Button>
          <LoadingButton
            variant="contained"
            color="success"
            type="submit"
            startIcon={<Done />}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserRegionSelect;
