import React from 'react';
import { Box, Stepper, Step, StepLabel, styled } from '@mui/material';
import CheckIcon from "@mui/icons-material/Check";
interface CustomStepIconProps {
  completed: boolean;
  active: boolean;
  isCompleted: boolean;
}

const CustomStepIcon: React.FC<CustomStepIconProps> = ({ completed, active, isCompleted }) => {
  return (
    <div>
      {/* Custom Step Icon Logic Here */}
      {isCompleted ? (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isCompleted
              ? "#0591FC" // Completed step color (grey)
              : active
                ? "#0591FC" // Active step color (blue)
                : "#E0E0E0", // Default step color
            color: isCompleted || active ? "#FFFFFF" : "#757575",
          }}
        >
          <CheckIcon fontSize="small" />
        </Box>
      ) : active ? (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isCompleted
              ? "#0591FC" // Completed step color (grey)
              : active
                ? "#0591FC" // Active step color (blue)
                : "#E0E0E0", // Default step color
            color: isCompleted || active ? "#FFFFFF" : "#757575",
          }}
        >
          <CheckIcon fontSize="small" />
        </Box>
      ) : completed ? (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isCompleted
              ? "#0591FC" // Completed step color (grey)
              : active
                ? "#0591FC" // Active step color (blue)
                : "#E0E0E0", // Default step color
            color: isCompleted || active ? "#FFFFFF" : "#757575",
          }}
        >
          <CheckIcon fontSize="small" />
        </Box>
      ) : (
        <span>⚪️</span>
      )}
    </div>
  );
};

const StyledStepLabel = styled(StepLabel)`
  & .Mui-completed {
    color: green;
  }
`;

interface CustomStepperProps {
  isCalculationDone: boolean;
  steps: any;
  activeStep: number;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ isCalculationDone, steps, activeStep }) => {
  return (
    <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StyledStepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon
                  completed={props.completed}
                  active={props.active}
                  isCompleted={isCalculationDone && index <= activeStep}
                />
              )}
            >
              {step.label}
            </StyledStepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CustomStepper;

