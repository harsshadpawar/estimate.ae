import React from "react";
import { Divider, Typography, Box } from "@mui/material";

const DividerWithText = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: '15px'
      }}
    >
      <Divider
        sx={{
          width: "42%",
          margin: "0 10px",
          borderColor: "#5C5C5C",
          gap: "15px",
        }}
      />
      <Typography variant="body2" sx={{ flexShrink: 0, padding: "0 10px" }}>
        Or
      </Typography>
      <Divider
        sx={{ width: "42%", margin: "0 10px", borderColor: "#5C5C5C" }}
      />
    </Box>
  );
};

export default DividerWithText;
