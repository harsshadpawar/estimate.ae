import React from "react";
import { Container, Grid, Typography, Box, Link } from "@mui/material";
import Maskgroup from "@/assets/images/Maskgroup.png";
import AuthComponent from "./Template";
import Email from "@/assets/images/Email.png";

const ForgetPassword = () => {
  return (
    <AuthComponent
      image={Maskgroup} // Replace with your image URL
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
            src={Email} // Replace with your image source
            alt="Email Confirmation"
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
          Password Recovery Email Sent
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
          A message has been sent to
          <span style={{ color: "#0591FC", textDecoration: "underline" }}>
            xxxxxxxx09gmail.com
          </span>{" "}
          with instructions to reset your password.
        </Typography>

        {/* Footer */}
        <Typography
          sx={{
            fontSize: "14px",
            // marginTop: "100px",
            // padding: "0 250px",
            width: "50%",
            mt: 5,
            color: "#5C5C5C",
          }}
        >
          Didn't receive the email? Check your spam filter or try another email
          address or{" "}
          <Link
            href="#"
            underline="hover"
            sx={{ color: "#007BFF", fontWeight: "500" }}
          >
            <span style={{ color: "#0591FC", textDecoration: "underline" }}>
              Resend recovery mail
            </span>
          </Link>
        </Typography>
      </Box>
    </AuthComponent>
  );
};

export default ForgetPassword;
