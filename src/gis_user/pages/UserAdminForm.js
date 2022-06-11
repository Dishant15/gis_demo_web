import React, { useCallback, useMemo, useState } from "react";

import { Box, Stack, Typography, Divider } from "@mui/material";
import UserFormSteps from "gis_user/components/UserFormSteps";
import UserForm from "gis_user/components/UserForm";
import UserPermissions from "gis_user/components/UserPermissions";
import UserRegionSelect from "gis_user/components/UserRegionSelect";

/**
 * Wrapper around 3 step user form
 * handle user step change states
 *
 * Parent:
 *  App
 * Renders
 *  UserForm
 *
 */
const UserAdminForm = () => {
  const [step, setStep] = useState(0);

  const goToNextStep = useCallback(() => {
    setStep((step) => step + 1);
  }, [setStep]);

  const goToPrevStep = useCallback(() => {
    setStep((step) => step - 1);
  }, [setStep]);

  const FormComponent = useMemo(() => {
    switch (step) {
      case 0:
        return <UserForm onSubmit={goToNextStep} />;

      case 1:
        return (
          <UserPermissions onSubmit={goToNextStep} goBack={goToPrevStep} />
        );

      case 2:
        return <UserRegionSelect goBack={goToPrevStep} />;
    }
  }, [step]);

  return (
    <Stack>
      <Stack p={2} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          Add User
        </Typography>
      </Stack>

      <Divider flexItem />

      <Box my={2} px={2}>
        <UserFormSteps
          activeStep={step}
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
