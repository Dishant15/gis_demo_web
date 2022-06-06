import { Box, Step, StepLabel, Typography, Stepper } from "@mui/material";
import React from "react";

const UserFormSteps = ({ stepList, activeStep }) => {
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
            <Step key={text} completed={completed}>
              <StepLabel optional={optional}>{text}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default UserFormSteps;
