import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";

import get from "lodash/get";
import has from "lodash/has";
import find from "lodash/find";

import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  Skeleton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { FormCheckbox } from "components/common/FormFields";
import { FormSelect } from "components/common/FormFields";

import { addNotification } from "redux/reducers/notification.reducer";
import { fetchUserRoles, updateUserPerm } from "gis_user/data/services";
import { parseErrorMessagesWithFields } from "utils/api.utils";

export const USER_LAYER_PERMS_CONFIG = [
  { name: "Distribution Point", layerKey: "p_dp" },
  { name: "Spliter", layerKey: "p_splitter" },
  { name: "Cable", layerKey: "p_cable" },
  { name: "Survey building", layerKey: "p_survey_building" },
  { name: "Survey area", layerKey: "p_survey_area" },
  { name: "Pop Location", layerKey: "p_pop" },
  { name: "Sub Pop Location", layerKey: "p_spop" },
  { name: "Feeder Service Area", layerKey: "p_fsa" },
  { name: "OLT", layerKey: "p_olt" },
  { name: "Distribution Service Area", layerKey: "p_dsa" },
  { name: "Customer Service Area", layerKey: "p_csa" },
  { name: "Pole", layerKey: "p_pole" },
  { name: "Manhole", layerKey: "p_manhole" },
  { name: "Joint Closer", layerKey: "p_jointcloser" },
];

/**
 * Parent:
 *    UserAdminForm
 */
const UserPermissions = ({
  userId,
  isSuperUser,
  userPermissions,
  role,
  onSubmit,
  goBack,
}) => {
  const dispatch = useDispatch();
  const { isFetching, data = [] } = useQuery("userRoles", fetchUserRoles);

  const { mutate, isLoading } = useMutation(updateUserPerm, {
    onSuccess: (res) => {
      dispatch(
        addNotification({
          type: "success",
          title: "User Permissions",
          text: "User permissions updated successfully",
        })
      );
      onSubmit(res);
    },
    onError: (err) => {
      const { fieldList, messageList } = parseErrorMessagesWithFields(err);
      for (let index = 0; index < fieldList.length; index++) {
        const field = fieldList[index];
        const errorMessage = messageList[index];
        dispatch(
          addNotification({
            type: "error",
            title: field,
            text: errorMessage,
          })
        );
      }
    },
  });

  const {
    formState: { errors, isDirty },
    handleSubmit,
    watch,
    control,
    reset,
  } = useForm({
    defaultValues: { ...userPermissions, role_id: role },
  });

  const handlePermissionSubmit = useCallback(
    (data) => {
      if (isDirty) {
        let newData;
        if (!!data.role_id) {
          newData = { role_id: data.role_id };
        } else {
          newData = {
            ...data,
            id: undefined,
            role_id: undefined,
            created_by: undefined,
            created_on: undefined,
            updated_on: undefined,
            name: undefined,
          };
        }
        mutate({ userId, data: newData });
      } else {
        onSubmit(userPermissions);
      }
    },
    [isDirty]
  );

  const handleRoleChange = useCallback(
    (newValue) => {
      if (newValue) {
        const currRole = find(data, ["id", newValue]);

        reset(
          {
            ...currRole,
            role_id: newValue,
            created_by: undefined,
            created_on: undefined,
            updated_on: undefined,
          },
          { keepDirty: true }
        );
      }
    },
    [data, reset]
  );

  const disabledAll = !!watch("role_id");

  if (isSuperUser) {
    return (
      <Box p={4}>
        <Stack minHeight={400} alignItems="center" justifyContent="center">
          <Typography variant="h4" color="primary">
            You don't required any permissions.
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" pt={4}>
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
            endIcon={<ArrowForwardIosIcon />}
            onClick={() => onSubmit(userPermissions)}
          >
            Next
          </LoadingButton>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      pt={2}
      component="form"
      onSubmit={handleSubmit(handlePermissionSubmit)}
      sx={{
        overflow: "auto",
      }}
    >
      <Stack
        flex={1}
        p={4}
        justifyContent="center"
        sx={{ width: "50%", margin: "0 auto" }}
      >
        {isFetching ? (
          <Skeleton animation="wave" height={90} />
        ) : (
          <FormSelect
            label="User Role"
            name="role_id"
            control={control}
            options={data || []}
            labelKey="name"
            valueKey="id"
            error={!!errors.role_id}
            helperText={errors.role_id?.message}
            isClearable
            onChange={handleRoleChange}
          />
        )}
      </Stack>
      <PermissionHeader>General</PermissionHeader>
      <Divider />
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        minHeight={54}
        justifyContent="center"
      >
        <PermissionLabel>User</PermissionLabel>
        <Stack flexDirection="row" minWidth={400}>
          <FormCheckbox
            label="View"
            name="user_view"
            control={control}
            error={!!errors.user_view}
            helperText={errors.user_view?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Add"
            name="user_add"
            control={control}
            error={!!errors.user_add}
            helperText={errors.user_add?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Edit"
            name="user_edit"
            control={control}
            error={!!errors.user_edit}
            helperText={errors.user_edit?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Download"
            name="user_download"
            control={control}
            error={!!errors.user_download}
            helperText={errors.user_download?.message}
            color="secondary"
            disabled={disabledAll}
          />
        </Stack>
      </Stack>
      <Divider />
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        minHeight={54}
        justifyContent="center"
      >
        <PermissionLabel>Region</PermissionLabel>
        <Stack flexDirection="row" minWidth={400}>
          <FormCheckbox
            label="View"
            name="region_view"
            control={control}
            error={!!errors.region_view}
            helperText={errors.region_view?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Add"
            name="region_add"
            control={control}
            error={!!errors.region_add}
            helperText={errors.region_add?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Edit"
            name="region_edit"
            control={control}
            error={!!errors.region_edit}
            helperText={errors.region_edit?.message}
            color="secondary"
            disabled={disabledAll}
          />
        </Stack>
      </Stack>
      <PermissionHeader>Ticket</PermissionHeader>
      <Divider />
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        minHeight={54}
        justifyContent="center"
      >
        <PermissionLabel>Ticket</PermissionLabel>
        <Stack flexDirection="row" minWidth={400}>
          <FormCheckbox
            label="View"
            name="ticket_view"
            control={control}
            error={!!errors.ticket_view}
            helperText={errors.ticket_view?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Add"
            name="ticket_add"
            control={control}
            error={!!errors.ticket_add}
            helperText={errors.ticket_add?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Edit"
            name="ticket_edit"
            control={control}
            error={!!errors.ticket_edit}
            helperText={errors.ticket_edit?.message}
            color="secondary"
            disabled={disabledAll}
          />
        </Stack>
      </Stack>
      <Divider />
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        minHeight={54}
        justifyContent="center"
      >
        <PermissionLabel>Workorders</PermissionLabel>
        <Stack flexDirection="row" minWidth={400}>
          <FormCheckbox
            label="View"
            name="ticket_workorder_view"
            control={control}
            error={!!errors.ticket_workorder_view}
            helperText={errors.ticket_workorder_view?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Add"
            name="ticket_workorder_add"
            control={control}
            error={!!errors.ticket_workorder_add}
            helperText={errors.ticket_workorder_add?.message}
            color="secondary"
            disabled={disabledAll}
          />
          <FormCheckbox
            label="Edit"
            name="ticket_workorder_edit"
            control={control}
            error={!!errors.ticket_workorder_edit}
            helperText={errors.ticket_workorder_edit?.message}
            color="secondary"
            disabled={disabledAll}
          />
        </Stack>
      </Stack>
      <PermissionHeader>Survey</PermissionHeader>
      <Divider />
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        minHeight={54}
        justifyContent="center"
      >
        <PermissionLabel>Survey</PermissionLabel>
        <Stack flexDirection="row" minWidth={400}>
          <FormCheckbox
            label="View"
            name="survey_view"
            control={control}
            error={!!errors.survey_view}
            helperText={errors.survey_view?.message}
            color="secondary"
            disabled={disabledAll}
          />
        </Stack>
      </Stack>
      <PermissionHeader>Planning</PermissionHeader>
      <Divider />
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        minHeight={54}
        justifyContent="center"
      >
        <PermissionLabel>Planning</PermissionLabel>
        <Stack flexDirection="row" minWidth={400}>
          <FormCheckbox
            label="View"
            name="planning_view"
            control={control}
            error={!!errors.planning_view}
            helperText={errors.planning_view?.message}
            color="secondary"
            disabled={disabledAll}
          />
        </Stack>
      </Stack>
      <Divider />
      {USER_LAYER_PERMS_CONFIG.map((userPermConf) => {
        const { name, layerKey } = userPermConf;

        return (
          <React.Fragment key={layerKey}>
            <Stack
              spacing={2}
              direction={{ md: "row", xs: "column" }}
              minHeight={54}
              justifyContent="center"
            >
              <PermissionLabel>{name}</PermissionLabel>
              <Stack flexDirection="row" minWidth={400}>
                <FormCheckbox
                  label="View"
                  name={`${layerKey}_view`}
                  control={control}
                  error={has(errors, `${layerKey}_view`)}
                  helperText={get(errors, `${layerKey}_view.message`, "")}
                  color="secondary"
                  disabled={disabledAll}
                />
                <FormCheckbox
                  label="Add"
                  name={`${layerKey}_add`}
                  control={control}
                  error={has(errors, `${layerKey}_add`)}
                  helperText={get(errors, `${layerKey}_add.message`, "")}
                  color="secondary"
                  disabled={disabledAll}
                />
                <FormCheckbox
                  label="Edit"
                  name={`${layerKey}_edit`}
                  control={control}
                  error={has(errors, `${layerKey}_edit`)}
                  helperText={get(errors, `${layerKey}_edit.message`, "")}
                  color="secondary"
                  disabled={disabledAll}
                />
                <FormCheckbox
                  label="Download"
                  name={`${layerKey}_download`}
                  control={control}
                  error={has(errors, `${layerKey}_download`)}
                  helperText={get(errors, `${layerKey}_download.message`, "")}
                  color="secondary"
                  disabled={disabledAll}
                />
                <FormCheckbox
                  label="Upload"
                  name={`${layerKey}_upload`}
                  control={control}
                  error={has(errors, `${layerKey}_upload`)}
                  helperText={get(errors, `${layerKey}_upload.message`, "")}
                  color="secondary"
                  disabled={disabledAll}
                />
              </Stack>
            </Stack>
            <Divider />
          </React.Fragment>
        );
      })}
      <Stack flex={1} direction="row" justifyContent="space-between" pt={4}>
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
          endIcon={<ArrowForwardIosIcon />}
          loading={isLoading}
        >
          Next
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export const PermissionLabel = (props) => {
  return (
    <Typography
      variant="h6"
      component="div"
      color="primary"
      mt="10px"
      minWidth={240}
    >
      {props.children}
    </Typography>
  );
};

export const PermissionHeader = (props) => {
  return (
    <Typography
      variant="h5"
      gutterBottom
      component="div"
      textAlign="center"
      mt={2.5}
    >
      {props.children}
    </Typography>
  );
};

export default UserPermissions;
