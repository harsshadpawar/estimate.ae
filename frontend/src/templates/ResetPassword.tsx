import React from "react";
import { Container, Grid, Typography, Box, Link } from "@mui/material";
import Reset from "../assets/images/ResetPassword.png";
import AuthComponent from "./Template";
import Sucess from "../assets/images/Success.png";
import CustomButton from "../components/common/Button";

const ResetPassword = () => {
  const handleButtonClick = () => {
    alert("Login button clicked!");
  };
  return (
    <AuthComponent
      image={Reset} // Replace with your image URL
    >
      {/* Any additional elements if needed */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 0,
          height: "auto", // Full height screen

          textAlign: "center",
        }}
      >
        {/* Icon or Image */}
        <Box
          sx={{
            width: "200px",
            height: "235px",
          }}
        >
          {/* Replace with an actual image */}
          <img
            src={Sucess} // Replace with your image source
            alt="Sucess Confirmation"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: "600",
            fontSize: "28px",
            lineHEight: "33.89px",
            color: "#0591FC", // Blue color
            mb: 2,
          }}
        >
          Congratulations!
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: {
              xs: "14px", // Smaller font size for small screens
              sm: "16px", // Medium font size for medium screens
              md: "18px", // Default font size for larger screens
            },
            color: "#5C5C5C",
            lineHeight: "30px", // Gray color
            textAlign: "center",
            // padding: "0 200px",

            width: "75%",
            fontWeight: "400",
          }}
        >
          Password reset successfully. Sign in below to continue.
        </Typography>
        <Box
          sx={{
            mt: 10,

            width: "50%",
          }}
        >
          <CustomButton
            text="Sign In"
            color="#0591FC"
            width="100%"
            height="60px"
            padding="0 0px"
            borderRadius="12px"
            textColor="#FFFFFF"
            onClick={handleButtonClick}
            type="submit"
          />
        </Box>
      </Box>
    </AuthComponent>
  );
};

export default ResetPassword;
