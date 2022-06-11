import React, { useCallback } from "react";

import { Box, Step, StepLabel, Typography, Stepper } from "@mui/material";

const UserFormSteps = ({ stepList, activeStep, onStepClick }) => {
  const handleStepClick = useCallback(
    (step) => () => {
      if (!!onStepClick) onStepClick(step);
    },
    [onStepClick]
  );

  const hasClickHandler = !!onStepClick;

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {stepList.map((step, index) => {
          const { isStepOptional, text, completed } = step;

          let optional;
          if (isStepOptional) {
            optional = <Typography variant="caption">Optional</Typography>;
          }
          return (
            <Step
              key={text}
              completed={completed}
              onClick={handleStepClick(index)}
              sx={{ cursor: hasClickHandler ? "pointer" : "inherit" }}
            >
              <StepLabel optional={optional}>{text}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default UserFormSteps;
