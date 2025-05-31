import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

// ✅ Custom styled connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#0591fc",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#0591fc",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#E0E0E0",
    borderRadius: 1,
  },
}));

// ✅ Custom step icon
const CustomStepIcon: React.FC<StepIconProps> = ({ active, completed }) => {
  const isDone = completed || active;

  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDone ? "#0591FC" : "#E0E0E0",
        color: "#fff",
      }}
    >
      <CheckIcon fontSize="small" />
    </Box>
  );
};

interface CustomStepperProps {
  steps: { label: string }[];
  activeStep: number;
}

// ✅ Custom stepper
const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  activeStep ,
}) => {
  return (
    <Box sx={{ width: "100%", py: 5 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />} // 👈 use the custom connector here
      >
        {steps.map((step, index) => {
          const isActiveOrCompleted = index <= activeStep;
          return (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                StepIconComponent={CustomStepIcon}
                sx={{
                  "& .MuiStepLabel-label": {
                    mt: 1,
                    fontSize: "10px",
                    fontWeight: 600,
                    color: isActiveOrCompleted ? "#0b87e6" : "#9E9E9E",
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default CustomStepper;
