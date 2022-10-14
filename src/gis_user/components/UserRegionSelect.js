import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";

import split from "lodash/split";
import join from "lodash/join";

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
  const queryRes = useQuery(["regionList", "data"], fetchRegionList, {
    onSuccess: (regionListData) => {
      setValue("region", join(regions, ","));
    },
  });
  const { isFetching: regionListLoading, data: regionList } = queryRes;

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
    mutate({
      userId,
      data: {
        regionIdList: !!data.region
          ? split(data.region, ",").map((d) => Number(d))
          : [],
      },
    });
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
              options={regionList || []}
              labelKey="name"
              valueKey="id"
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
