import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Google from "@/assets/images/Google.png";
import { Box } from "@mui/material";
export default function SocialButton({
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
}:any) {
  // Determine which icon to display based on the platform

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
