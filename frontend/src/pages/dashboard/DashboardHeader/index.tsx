import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import PathImg from "../../../assets/images/Path.png";
import Dashboard from "../../../assets/images/Group.png";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const user = useSelector((state: any) => state.auth.userProfileData);
  return (
    <Box
      sx={{
        backgroundColor: "#A7D8FF", // Light blue background
        borderRadius: "8px",
        padding: { xs: '20px', sm: "40px" },
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
        backgroundImage: `url(${PathImg})`, // Replace with actual cloud image URL
        backgroundPosition: "bottom right",
        backgroundSize: "25%",
        backgroundRepeat: "no-repeat",
      }}
    >
        {/* Image Section */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "0 0 25%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Box
            component="img"
            src={Dashboard} // Replace with the dashboard image URL
            alt="Dashboard Icon"
            sx={{
              width: { xs: "100px", sm: "120px" }, // Adjust image size
              height: "auto",
              borderRadius: "8px",
              ml: 0,
              // boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
              // display: { xs: "none", sm: "block" },
            }}
          />
        </Box>

        {/* Text Section */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "0 0 75%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: "700",
              color: "#0591FC",
              fontSize: { xs: "25px", sm: "30px" },
              lineHeight: "32px", // Primary blue color
              fontFamily: "Inter, sans-serif",
            }}
          >
            Hello, {user?.first_name}!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              mt: 1,
              maxWidth: "600px",
              fontWeight: "400",

              fontSize: {
                xs: "12px", // Small font size for mobile
                sm: "14px", // Medium font size for tablets
                md: "18px", // Larger font size for desktop
              },
              lineHeight: "30px", // Primary blue color
              fontFamily: "Inter, sans-serif", // Limiting text width
              textAlign: "justify",
            }}
          >
            Welcome to your dashboard.
          </Typography>
        </Box>
    </Box >
  );
};

export default DashboardHeader;