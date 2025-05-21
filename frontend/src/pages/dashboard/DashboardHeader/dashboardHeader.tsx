import React from "react";
import { Box, Typography } from "@mui/material";
import PathImg from "@/assets/images/Path.png";
import Dashboard from "@/assets/images/Group.png";
import { useSelector } from "react-redux";
import { steptext } from "../../menus/headerItems";

const DashboardHeader = ({ step }: any) => {
  const user = useSelector((state: any) => state.auth.userProfileData);

  const stepContent = steptext.find((s) => s.step === step) || {
    title: "Welcome to your dashboard.",
    description: "",
    description1:""
  };

  return (
    <Box
      sx={{
        backgroundColor: "#A7D8FF",
        borderRadius: "8px",
        padding: { xs: '20px', sm: "20px" },
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
        backgroundImage: `url(${PathImg})`,
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
          src={Dashboard}
          alt="Dashboard Icon"
          sx={{
            width: { xs: "100px", sm: "120px",md:'180px' },
            height: "auto",
            borderRadius: "8px",
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
            lineHeight: "32px",
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
            maxWidth: "1182.42px",
            fontWeight: "700",
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "18px",
            },
            lineHeight: "30px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {stepContent.title}
        </Typography>

        {stepContent.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              mt: 1,
              maxWidth: "1182.42px",
              fontWeight: "700",
              fontSize: {
                xs: "12px",
                sm: "14px",
                md: "18px",
              },
              lineHeight: "30px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {stepContent.description}
          </Typography>
        )}
        {stepContent.description1 && (
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              mt: 1,
              maxWidth: "1182.42px",
              fontWeight: "700",
              fontSize: {
                xs: "12px",
                sm: "14px",
                md: "18px",
              },
              lineHeight: "30px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {stepContent.description1}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardHeader;
