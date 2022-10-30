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

  const { isLoading, data, refetch } = useQuery(
    ["userDetails", params.userId],
    fetchUserDetails,
    {
      enabled: !!params.userId,
      staleTime: Infinity,
    }
  );

  const user = get(data, "user", {});
  const permissions = get(data, "permissions", {});

  const handleUserCreate = useCallback((res) => {
    setUserId(res.user.id);
    goToNextStep();
  }, []);

  const handleUserEdit = useCallback(() => {
    refetch();
    goToNextStep();
  }, [refetch]);

  const handleUserEditPerm = useCallback(() => {
    refetch();
    goToNextStep();
  }, []);

  const goToNextStep = useCallback(() => {
    setStep((step) => step + 1);
  }, [step, setStep]);

  const goToPrevStep = useCallback(() => {
    setStep((step) => step - 1);
  }, [step, setStep]);

  const goToStep = useCallback(
    (step) => {
      setStep(step);
    },
    [setStep]
  );

  if (isLoading) {
    return (
      <Box p={2}>
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  const isEdit = !!userId;
  let FormComponent;

  switch (step) {
    case 0:
      FormComponent = isEdit ? (
        <UserEditForm
          // user edited data is not updated if we don't force re render this form
          key={Number(new Date())}
          onSubmit={handleUserEdit}
          formData={user}
        />
      ) : (
        <UserAddForm onSubmit={handleUserCreate} />
      );
      break;

    case 1:
      FormComponent = (
        <UserPermissions
          userId={userId}
          userPermissions={permissions || {}}
          onSubmit={handleUserEditPerm}
          goBack={goToPrevStep}
          isSuperUser={get(user, "is_superuser", false)}
          role={get(user, "role")}
        />
      );
      break;

    case 2:
      FormComponent = (
        <UserRegionSelect
          userId={userId}
          goBack={goToPrevStep}
          regions={get(user, "regions", [])}
        />
      );
      break;
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
