import { Box, Container, Typography } from "@mui/material";
import React from "react";
import LOGO from "@/assets/images/logomain.png";

interface AuthProps {
  image?: string; // Optional image for flexibility
  children: React.ReactNode;
}

const AuthComponent = ({ image = LOGO, children }: AuthProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#F1F1F1",
        padding: "10px",
        backgroundColor: "white",
        height: "auto%", // Full screen height
        // alignItems: "center", // Vertical centering
        // justifyContent: "center", // Horizontal centering
      }}
    >
      {/* Left Side - Image Section */}
      <Box
        sx={{
          flex: { xs: 0, sm: 6, md: 6 },
          height: "95vh",
          display: { xs: "none", sm: "none", md: "flex" }, // Use flex to center the image
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px", // Corner radius
          overflow: "hidden", // Ensures the background image respects the border radius
          backgroundImage: `url(${image})`,
          backgroundSize: "100% 100%", // Adjust image size
          // backgroundPosition: "center",
        }}
      />

      {/* Right Side - Content Section */}
      <Box
        sx={{
          flex: { xs: 12, sm: 6, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Vertical centering
          alignItems: "center", // Horizontal centering
          p: 3,
          // mx: "auto",
        }}
      >
        {/* Logo */}

        {/* Content Container */}
        <Box
          sx={{
            width: "100%",
            textAlign: "center", // Center text horizontally
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthComponent;
