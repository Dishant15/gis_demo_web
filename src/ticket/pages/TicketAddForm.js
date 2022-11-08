import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Box, Stack, Typography, Divider, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import AddTicketForm from "ticket/components/AddTicketForm";
import TicketMap from "ticket/components/TicketMap";
import UserFormSteps from "gis_user/components/UserFormSteps";
import { getTicketListPage } from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";

const TicketAddForm = () => {
  /**
   * Parent:
   *  TicketAdminPage -> Outlet -> App
   */
  const dispatch = useDispatch();
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

  const handleNextStep = useCallback((data) => {
    dispatch(
      addNotification({
        type: "warning",
        title: "Please Add Coordinates.",
      })
    );
    goToNextStep(data);
  }, []);

  const FormComponent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <AddTicketForm
            onSubmit={handleNextStep}
            formData={{}}
            isEdit={false}
            formCancelButton={
              <Button
                variant="outlined"
                color="error"
                component={Link}
                to={getTicketListPage()}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
            }
            formActionProps={{
              p: 4,
              justifyContent: "space-between",
            }}
            formSubmitButtonProps={{
              variant: "outlined",
              color: "success",
              endIcon: <ArrowForwardIosIcon />,
            }}
            formSubmitButtonText="Next"
          />
        );

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
