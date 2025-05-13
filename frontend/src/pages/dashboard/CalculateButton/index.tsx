import React from "react";
import { Button, Box } from "@mui/material";
import "./calculateButton.css";

const CalculateButton = ({handleCalculateCosts, disabled, isCalculationDone, handleChangeModel, handleChangeParams}) => { 
  return (
    <>
      {!isCalculationDone && (
          <Box className="calculate-btn-ctn">
              <Button disabled={disabled} variant="contained" color="primary" size="large" onClick={handleCalculateCosts}>
                Calculate
              </Button>
          </Box>
      )}
      {isCalculationDone && (
          <Box className="reset-btn-ctn">
              <Button 
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleChangeModel}
              >
                Change Model
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleChangeParams}
              >
                Change Parameters
              </Button>
          </Box>
      )}
    </>
  );
};

export default CalculateButton;
