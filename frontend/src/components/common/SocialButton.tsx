import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Google from "../../Assets/images/Google.png";
import { Height } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import {
  color,
  fontSize,
  fontWeight,
  height,
  lineHeight,
  style,
  textAlign,
  width,
} from "@mui/system";
export default function SocialButton({
  platform, // "google" or "facebook" or any other platform
  onClick = () => {},
  text,
  color,
  width,
  height,
  fontFamily,
  borderRadius,
  padding,
  gap,
  border,
}) {
  // Determine which icon to display based on the platform
  const renderIcon = () => {
    switch (platform) {
      case "google":
        return <FaGoogle style={{ color: "#4285F4", fontSize: "24px" }} />;
      case "facebook":
        return <FaFacebook style={{ color: "#1877F2", fontSize: "24px" }} />;
      default:
        return null;
    }
  };

  return (
    <Stack spacing={2} direction="row">
      <Button
        variant="contained"
        style={{
          backgroundColor: color,
          width: width || "auto", // Default to 'auto' if no width is provided
          height: height || "50px", // Default height
          fontFamily: fontFamily || "Inter, sans-serif",
          borderRadius: borderRadius || "8px", // Default border radius
          padding: padding || "12px 16px", // Default padding
          gap: gap,
          border: border,
        }}
        onClick={onClick}
      >
        <img
          src={Google}
          alt="Google"
          style={{ height: "20px", width: "20px" }}
        />
        {/*<span
          style={{
            textAlign: "center",
            fontWeight: "500",
            fontSize: "20px",
            lineHeight: "28px",
            color: "#131112",
          }}
        >
          {text}
        </span>*/}
        <Box
          sx={{
            textAlign: "center",
            fontWeight: "500",
            fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "20px" }, // Responsive font size
            lineHeight: "28px",
            color: "#131112",
            marginLeft: "10px",
          }}
        >
          {text}
        </Box>
      </Button>
    </Stack>
  );
}
