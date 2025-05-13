import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

export default function CustomButton({
  text,
  color,
  onClick = () => {},
  width,
  fontFamily,
  height,
  borderRadius,
  padding,
  textColor,
}:any) {
  return (
    <Stack spacing={2} direction="row">
      <Button
        variant="contained"
        style={{
          backgroundColor: color,
          width: width || "auto", // Default to 'auto' if no width is provided
          fontFamily: "Inter, sans-serif",
          height: height,
          borderRadius: borderRadius,
          padding: padding,
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            color: textColor || "#fff", // Text color
            fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "18px" }, // Responsive font size
            lineHeight: "24px",
            fontweight: "600",
          }}
        >
          {text}
        </Box>
      </Button>
    </Stack>
  );
}
