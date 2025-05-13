import React from "react";
import { Box, Button, Typography, Paper, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomButton from "../../../components/common/Button";
import { SlCloudUpload } from "react-icons/sl";
const ModelSelection = ({ onUpload }) => {
  const handleChnage = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    onUpload(files[0]);
  };

  return (
    <Box
      sx={{
        // marginTop: "20px",
        padding: "20px",
        border: "2px dashed #0591FC80",
        borderRadius: "8px",
      }}
    >
      {/* <Typography variant="h6" align="center">
        Select a Sample Model
      </Typography>*/}

      <input
        accept=".stp,.dwg,.dxf"
        style={{ display: "none" }}
        id="upload-file"
        type="file"
        multiple
        onChange={handleChnage}
      />
      <label htmlFor="upload-file">
        <Box
          // component="div"
          sx={{
            // display: "block",

            padding: "12px 12px",
            textAlign: "center",
            backgroundColor: "#0591FC",
            color: "#fff",
            borderRadius: "14px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#0591FC",
            },
          }}
        >
          Select a Sample Model
        </Box>
      </label>
      <Typography variant="body2" align="center" sx={{ margin: "10px 0" }}>
        OR
      </Typography>
      <Paper
        sx={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",

        }}
        elevation={0}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #DBD9DC', padding: '15px', borderRadius: '10px', gap: 2 }}>
          <SlCloudUpload size={50} />
          <Typography variant="body2" sx={{ marginTop: "8px" }}>
            Drag & drop or choose your CSD file to upload here.
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: "8px" }}
        >
          *Accepted files: doc, pdf, xcl <br />
          *Maximum file size: 100MB
        </Typography>
      </Paper>
    </Box>
  );
};

export default ModelSelection;