import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { map, filter, indexOf } from "lodash";
import { useDispatch } from "react-redux";

import { Box, Skeleton, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Done } from "@mui/icons-material";
import { FormSelect } from "components/common/FormFields";

import { fetchRegionList } from "region/data/services";
import { updateUserRegion } from "gis_user/data/services";
import { getUserListPage } from "utils/url.constants";
import { parseBadRequest } from "utils/api.utils";
import { addNotification } from "redux/reducers/notification.reducer";

const UserRegionSelect = ({ goBack, userId, regions }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { isLoading: regionListLoading, data: regionList } = useQuery(
    "regionList",
    fetchRegionList,
    {
      initialData: [],
      onSuccess: (regionListData) => {
        const region = filter(
          regionListData,
          (regionData) => indexOf(regions, regionData.id) !== -1
        );
        if (region) {
          setValue("region", region);
        }
      },
    }
  );

  const { mutate, isLoading } = useMutation(updateUserRegion, {
    onSuccess: (res) => {
      navigate(getUserListPage());
      dispatch(
        addNotification({
          type: "success",
          title: "User region update",
          text: "User region updated successfully",
        })
      );
    },
    onError: (err) => {
      const parsedError = parseBadRequest(err);
      if (parsedError) {
        for (const key in parsedError) {
          if (Object.hasOwnProperty.call(parsedError, key)) {
            setError(key, { message: parsedError[key][0] });
          }
        }
      }
    },
  });

  const onSubmit = (data) => {
    mutate({ userId, data: { regionIdList: map(data.region, "id") } });
  };

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    setValue,
  } = useForm();

  return (
    <Box>
      <Box p={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack
          flex={1}
          p={4}
          justifyContent="center"
          sx={{ width: "50%", margin: "0 auto" }}
        >
          {regionListLoading ? (
            <Skeleton animation="wave" height={90} />
          ) : (
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
            />
          )}
        </Stack>
        <Stack flex={1} p={4} direction="row" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            startIcon={<ArrowBackIosIcon />}
            onClick={goBack}
          >
            Back
          </Button>
          <LoadingButton
            variant="outlined"
            color="success"
            type="submit"
            startIcon={<Done />}
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserRegionSelect;
