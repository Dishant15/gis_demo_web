import React, { useCallback, useMemo, useState } from "react";

import { Box, Stack, Typography, Divider } from "@mui/material";
import AddTicketForm from "ticket/components/AddTicketForm";
import TicketMap from "ticket/components/TicketMap";
import UserFormSteps from "gis_user/components/UserFormSteps";

const TicketAddForm = () => {
  /**
   * Parent:
   *  TicketAdminPage -> Outlet -> App
   */
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);

  const goToNextStep = useCallback(
    (data) => {
      setStep((step) => step + 1);
      setFormData(data);
    },
    [setStep]
  );

  const goToPrevStep = useCallback(() => {
    setStep((step) => step - 1);
  }, [setStep]);

  const FormComponent = useMemo(() => {
    switch (step) {
      case 0:
        return <AddTicketForm onSubmit={goToNextStep} formData={{}} />;

      case 1:
        return <TicketMap formData={formData} />;
    }
  }, [step]);

  return (
    <Stack height="100%">
      <Stack p={2} direction="row" spacing={2} width="100%">
        <Typography
          color="primary.dark"
          flex={1}
          className="dtl-title"
          variant="h5"
        >
          Add Ticket
        </Typography>
      </Stack>

      <Divider flexItem />

      <Box my={2} px={2}>
        <UserFormSteps
          activeStep={step}
          stepList={[
            {
              isStepOptional: false,
              text: "Add Ticket",
              completed: step > 0,
            },
            {
              isStepOptional: false,
              text: "Add Coordinates",
              completed: false,
            },
          ]}
        />
      </Box>

      {FormComponent}
    </Stack>
  );
};

export default TicketAddForm;
