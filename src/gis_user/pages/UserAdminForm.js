import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { get, noop, size } from "lodash";

import {
  Box,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import UserFormSteps from "gis_user/components/UserFormSteps";
import UserAddForm from "gis_user/components/UserAddForm";
import UserEditForm from "gis_user/components/UserEditForm";
import UserPermissions from "gis_user/components/UserPermissions";
import UserRegionSelect from "gis_user/components/UserRegionSelect";

import { fetchUserDetails } from "../data/services";

/**
 * Wrapper around 3 step user form
 * handle user step change states
 *
 * Parent:
 *  App
 * Renders
 *  UserAddForm
 *  UserEditForm
 *  UserPermissions
 *  UserRegionSelect
 */
const UserAdminForm = () => {
  const params = useParams();
  const [step, setStep] = useState(0);
  // in case if edit, userId filled from url
  const [userId, setUserId] = useState(params.userId);
  const [userPermissions, setUserPermissions] = useState(null);

  const { isLoading, data } = useQuery(
    ["userDetails", params.userId],
    fetchUserDetails,
    { enabled: !!params.userId }
  );

  const handleUserCreate = useCallback((res) => {
    console.log(
      "🚀 ~ file: UserAdminForm.js ~ line 46 ~ handleUserCreate ~ res",
      res
    );
    setUserId(res.user.id);
    setUserPermissions(res.permissions);
    goToNextStep();
  }, []);

  const handleUserEdit = useCallback((res) => {
    console.log(
      "🚀 ~ file: UserAdminForm.js ~ line 52 ~ handleUserEdit ~ res",
      res
    );
    // user id already set from param
    setUserPermissions(res.permissions);
    goToNextStep();
  }, []);

  const handleUserEditPerm = useCallback((res) => {
    console.log(
      "🚀 ~ file: UserAdminForm.js ~ line 67 ~ handleUserEditPerm ~ res",
      res
    );
    setUserPermissions(res);
    goToNextStep();
  }, []);

  const goToNextStep = useCallback(() => {
    setStep((step) => step + 1);
  }, [setStep]);

  const goToPrevStep = useCallback(() => {
    setStep((step) => step - 1);
  }, [setStep]);

  const goToStep = useCallback(
    (step) => {
      setStep(step);
    },
    [setStep]
  );

  const isEdit = !!size(data);

  const FormComponent = useMemo(() => {
    switch (step) {
      case 0:
        return !!size(data) ? (
          <UserEditForm onSubmit={handleUserEdit} formData={data} />
        ) : (
          <UserAddForm onSubmit={handleUserCreate} />
        );

      case 1:
        return (
          <UserPermissions
            userId={userId}
            userPermissions={userPermissions}
            onSubmit={handleUserEditPerm}
            goBack={goToPrevStep}
            isSuperUser={get(data, "is_superuser", false)}
          />
        );

      case 2:
        return (
          <UserRegionSelect
            userId={userId}
            goBack={goToPrevStep}
            regions={get(data, "regions", [])}
          />
        );
    }
  }, [step, data]);

  if (isLoading) {
    return (
      <Box p={2}>
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  return (
    <Stack>
      <Stack p={2} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          {isEdit ? "Edit User details" : "Add New User"}
        </Typography>
      </Stack>

      <Divider flexItem />

      <Box my={2} px={2}>
        <UserFormSteps
          activeStep={step}
          onStepClick={isEdit ? goToStep : noop}
          stepList={[
            {
              isStepOptional: false,
              text: "Add / Update user details",
              completed: step > 0,
            },
            {
              isStepOptional: true,
              text: "Select user permissions",
              completed: step > 1,
            },
            {
              isStepOptional: false,
              text: "Assign regions current user can access",
              // directly redirect out of form once this completes
              completed: false,
            },
          ]}
        />
      </Box>

      {FormComponent}
    </Stack>
  );
};

export default UserAdminForm;
