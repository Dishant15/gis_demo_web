import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import has from "lodash/has";

import {
  Box,
  Stack,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { FormCheckbox } from "components/common/FormFields";

import { createDefaultPermissions } from "redux/selectors/auth.selectors";
import {
  PermissionHeader,
  PermissionLabel,
  USER_LAYER_PERMS_CONFIG,
} from "./UserPermissions";
import { getRequiredFieldMessage } from "utils/constant";
import {
  addUserRole,
  deleteUserRole,
  updateUserRole,
} from "gis_user/data/services";
import { addNotification } from "redux/reducers/notification.reducer";
import { COLORS } from "App/theme";

/**
 * Parent:
 *    UserRoleAdminPage
 *
 * data: if data is empty object, its add otherwise edit.
 */
const UserRoleForm = ({ data, handleRoleSelect }) => {
  const defaultPermissions = useSelector(createDefaultPermissions);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [showDialog, setshowDialog] = useState(null); // null or role id
  const isAdd = isEmpty(data);

  const {
    formState: { errors, isDirty },
    handleSubmit,
    control,
    register,
  } = useForm({
    defaultValues: isAdd ? { name: "", ...defaultPermissions } : data,
  });

  const { mutate: addUserRoleMutate, isLoading: addUserRoleLoading } =
    useMutation(addUserRole, {
      onSuccess: (res) => {
        // set new data to parent, for convert add form into edit
        handleRoleSelect(res)();
        queryClient.invalidateQueries("userRoles");
        dispatch(
          addNotification({
            type: "success",
            title: "User role",
            text: "User role added successfully",
          })
        );
      },
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "User role",
            text: "failed to add user role",
          })
        );
      },
    });

  const { mutate: updateUserRoleMutate, isLoading: updateUserRoleLoading } =
    useMutation(updateUserRole, {
      onSuccess: (res) => {
        queryClient.invalidateQueries("userRoles");
        dispatch(
          addNotification({
            type: "success",
            title: "User role",
            text: "User role updated successfully",
          })
        );
      },
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "User role",
            text: "failed to update user role",
          })
        );
      },
    });

  const { mutate: deleteMutation, isLoading: deleteLoading } = useMutation(
    deleteUserRole,
    {
      onSuccess: () => {
        // reset permission data
        handleRoleSelect(null)();
        handleDeleteClose();
        queryClient.invalidateQueries("userRoles");
        dispatch(
          addNotification({
            type: "success",
            title: "User role",
            text: "User role deleted successfully",
          })
        );
      },
      onError: () => {
        // reset permission data
        handleRoleSelect(null)();
        handleDeleteClose();
        dispatch(
          addNotification({
            type: "error",
            title: "User role",
            text: "failed to delete user role",
          })
        );
      },
    }
  );

  const handlePermissionSubmit = (data) => {
    if (isDirty) {
      if (data.id) {
        // edit
        updateUserRoleMutate({ roleId: data.id, data });
      } else {
        // add
        addUserRoleMutate(data);
      }
    }
  };

  const onDeleteConfirm = () => {
    deleteMutation(data.id);
  };

  const handleDeleteClose = () => {
    setshowDialog(null);
  };

  const handleDeleteShow = (roleId) => () => {
    setshowDialog(roleId);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handlePermissionSubmit)}>
      <Box
        p={1}
        mb={2}
        sx={{
          background: COLORS.primary.main,
          color: COLORS.primary.contrastText,
          textAlign: "center",
        }}
      >
        User Role Form
      </Box>
      <Stack
        spacing={2}
        direction={{ md: "row", xs: "column" }}
        justifyContent="center"
      >
        <PermissionLabel>Name</PermissionLabel>
        <Stack flexDirection="row" minWidth={260}>
          <TextField
            error={!!errors.name}
            label="Role Name *"
            {...register("name", {
              required: getRequiredFieldMessage("Role Name"),
            })}
            helperText={errors.name?.message}
            sx={{
              width: "100%",
            }}
          />
        </Stack>
      </Stack>
      <Box
        p={1}
        my={2}
        sx={{
          background: COLORS.primary.main,
          color: COLORS.primary.contrastText,
          textAlign: "center",
        }}
      >
        Permissions
      </Box>
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
          />
          <FormCheckbox
            label="Add"
            name="user_add"
            control={control}
            error={!!errors.user_add}
            helperText={errors.user_add?.message}
            color="secondary"
          />
          <FormCheckbox
            label="Edit"
            name="user_edit"
            control={control}
            error={!!errors.user_edit}
            helperText={errors.user_edit?.message}
            color="secondary"
          />
          <FormCheckbox
            label="Download"
            name="user_download"
            control={control}
            error={!!errors.user_download}
            helperText={errors.user_download?.message}
            color="secondary"
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
          />
          <FormCheckbox
            label="Add"
            name="region_add"
            control={control}
            error={!!errors.region_add}
            helperText={errors.region_add?.message}
            color="secondary"
          />
          <FormCheckbox
            label="Edit"
            name="region_edit"
            control={control}
            error={!!errors.region_edit}
            helperText={errors.region_edit?.message}
            color="secondary"
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
          />
          <FormCheckbox
            label="Add"
            name="ticket_add"
            control={control}
            error={!!errors.ticket_add}
            helperText={errors.ticket_add?.message}
            color="secondary"
          />
          <FormCheckbox
            label="Edit"
            name="ticket_edit"
            control={control}
            error={!!errors.ticket_edit}
            helperText={errors.ticket_edit?.message}
            color="secondary"
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
          />
          <FormCheckbox
            label="Add"
            name="ticket_workorder_add"
            control={control}
            error={!!errors.ticket_workorder_add}
            helperText={errors.ticket_workorder_add?.message}
            color="secondary"
          />
          <FormCheckbox
            label="Edit"
            name="ticket_workorder_edit"
            control={control}
            error={!!errors.ticket_workorder_edit}
            helperText={errors.ticket_workorder_edit?.message}
            color="secondary"
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
                />
                <FormCheckbox
                  label="Add"
                  name={`${layerKey}_add`}
                  control={control}
                  error={has(errors, `${layerKey}_add`)}
                  helperText={get(errors, `${layerKey}_add.message`, "")}
                  color="secondary"
                />
                <FormCheckbox
                  label="Edit"
                  name={`${layerKey}_edit`}
                  control={control}
                  error={has(errors, `${layerKey}_edit`)}
                  helperText={get(errors, `${layerKey}_edit.message`, "")}
                  color="secondary"
                />
                <FormCheckbox
                  label="Download"
                  name={`${layerKey}_download`}
                  control={control}
                  error={has(errors, `${layerKey}_download`)}
                  helperText={get(errors, `${layerKey}_download.message`, "")}
                  color="secondary"
                />
              </Stack>
            </Stack>
            <Divider />
          </React.Fragment>
        );
      })}
      <Stack
        flex={1}
        direction="row"
        justifyContent={isAdd ? "flex-end" : "space-between"}
        p={4}
      >
        {isAdd ? null : (
          <LoadingButton
            variant="outlined"
            color="error"
            type="button"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleDeleteShow(data.id)}
          >
            Delete
          </LoadingButton>
        )}
        <LoadingButton
          variant="outlined"
          color="success"
          type="submit"
          startIcon={<DoneIcon />}
          loading={addUserRoleLoading || updateUserRoleLoading}
        >
          Submit
        </LoadingButton>
      </Stack>
      <Dialog open={!!showDialog} onClose={handleDeleteClose}>
        {showDialog ? (
          <>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to delete Role <b>{get(data, "name")}</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClose}>Close</Button>
              <LoadingButton
                onClick={onDeleteConfirm}
                autoFocus
                loading={deleteLoading}
                color="error"
              >
                Delete
              </LoadingButton>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
};

export default UserRoleForm;
